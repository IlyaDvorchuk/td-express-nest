import { Body, Controller, Post, Res, UploadedFile, UseInterceptors, UsePipes } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ValidationPipe } from "../pipes/validation.pipe";
import { AuthShelterService } from "./auth-shelter.service";
import { CheckShelterDto } from "./dto/check-shelter.dto";
import { Response } from "express";
import { CreateShelterDto } from "../shelters/dto/create-shelter.dto";
import { FileInterceptor } from "@nestjs/platform-express";
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
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './static/shelter-scan',
        filename: editFileName
      }),
      fileFilter: imageFileFilter,
    })
  )
  async registration(@Body() shelterDto: CreateShelterDto,
                     @UploadedFile() image,
                     @Res() response: Response) {
    console.log('shelterDto', shelterDto);
    const photoPath = `${process.env.SERVER_URL}/shelter-scan/${image.filename}`
    const shelterData = await this.authService.registration(shelterDto, photoPath)
    response.cookie('refreshToken-shelter',
      shelterData,
      {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
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
