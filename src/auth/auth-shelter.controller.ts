import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
  UsePipes
} from "@nestjs/common";
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
        destination: (req, file, cb) => {
          let destination = './static/shelter-scans';
          if (file.fieldname === 'imageShop') {
            destination = './static/shelter-shops';
          }
          cb(null, destination);
        },
        filename: editFileName
      }),
      fileFilter: imageFileFilter,
    })
  )
  async registration(
    @Body() shelterDto: CreateShelterDto,
    @UploadedFiles() images: { fileScan?: Express.Multer.File, imageShop?: Express.Multer.File },
    @Res({passthrough: true}) response: Response
  ) {
    // console.log('shelterDto', shelterDto);
    const {fileScan, imageShop} = images
    const photoPath = `${process.env.SERVER_URL}/shelter-scans/${fileScan[0].filename}`
    const photoShopPath = `${process.env.SERVER_URL}/shelter-shops/${imageShop[0].filename}`
    const shelter = await this.authService.registration(
      shelterDto,
      photoPath,
      photoShopPath
    )
    console.log('shelterData', shelter);
    const token = await this.authService.createAccessToken(shelter);
    response.cookie('access_token_shelter', token, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    })
    // TODO if will https - add secure: true
    return shelter
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'Логин продавца'})
  @ApiResponse({status: 200, type: 'sddsf'})
  @UsePipes(ValidationPipe)
  @Post('/login')
  async login(@Body() userDto: EnterUserDto,
              @Res({passthrough: true}) response: Response) {
    const shelter = await this.authService.login(userDto)
    const token = await this.authService.createAccessToken(shelter);
    console.log('token 82', token);
    response.cookie('access_token_shelter', token, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    })
    // TODO if will https - add secure: true
    console.log('response', response);
    return shelter
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
