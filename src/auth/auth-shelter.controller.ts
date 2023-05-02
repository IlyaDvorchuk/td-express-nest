import {Body, Controller, Post, Res, UploadedFiles, UseInterceptors, UsePipes} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ValidationPipe } from "../pipes/validation.pipe";
import { AuthShelterService } from "./auth-shelter.service";
import { CheckShelterDto } from "./dto/check-shelter.dto";
import { Response } from "express";
import { CreateShelterDto } from "../shelters/dto/create-shelter.dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { editFileName, imageFileFilter } from "../utils/file-upload.utils";
import { EnterUserDto } from "../users/dto/enter-user.dto";
import { NewPasswordDto } from "./dto/new-password.dto";

@ApiTags('Авторизация продавца')
@Controller('auth-shelter')
export class AuthShelterController {
  constructor(private authService: AuthShelterService) {
  }

  // @UsePipes(ValidationPipe)
  @Post('/registration')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'fileScan', maxCount: 1 },
      { name: 'imageShop', maxCount: 1 },
    ], {
      storage: diskStorage({
        destination: './static',
        filename: editFileName
      }),
      fileFilter: imageFileFilter,
    })
      // FileInterceptor('fileScan', {
      //   storage: diskStorage({
      //     destination: './static/shelter-scan',
      //     filename: editFileName
      //   }),
      //   fileFilter: imageFileFilter,
      // }),
      // FileInterceptor('imageShop', {
      //   storage: diskStorage({
      //     destination: './static/shelter-shop',
      //     filename: editFileName
      //   }),
      //   fileFilter: imageFileFilter,
      // })
  )
  async registration(
      @Body() shelterDto: CreateShelterDto,
      @UploadedFiles() images: { fileScan?: Express.Multer.File, imageShop?: Express.Multer.File },
      @Res() response: Response
  ) {
    // console.log('shelterDto', shelterDto);
    const {fileScan, imageShop} = images
    // console.log('fileScan', fileScan);
    // console.log('imageShop', imageShop);
    const photoPath = `${process.env.SERVER_URL}/shelter-scan/${fileScan[0].filename}`
    const photoShopPath = `${process.env.SERVER_URL}/shelter-scan/${imageShop[0].filename}`
    const shelterData = await this.authService.registration(
        shelterDto,
        photoPath,
        photoShopPath
    )
    response.cookie('refreshToken-shelter', shelterData, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    })
    // TODO if will https - add secure: true
    console.log('shelterData', shelterData);
    return response.json(shelterData)
  }

  @ApiOperation({summary: 'Логин продавца'})
  @ApiResponse({status: 200, type: 'sddsf'})
  @UsePipes(ValidationPipe)
  @Post('/login')
  async login(@Body() userDto: EnterUserDto,
              @Res() response: Response) {
    const userData = await this.authService.login(userDto)
    response.cookie('refreshToken-shelter',
      userData,
      {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
    return response.json(userData)
  }

  @UsePipes(ValidationPipe)
  @Post('/check')
  async checkEmail(@Body() userDto: CheckShelterDto) {
    return await this.authService.checkEmail(userDto)
  }

  @Post('/create-password')
  async createNewPassword(@Body() passwordDto: NewPasswordDto) {
    return await this.authService.createNewPassword(passwordDto)
  }
}
