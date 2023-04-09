import { Body, Controller, Post, Res, UploadedFile, UseInterceptors, UsePipes } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ValidationPipe } from "../pipes/validation.pipe";
import { AuthShelterService } from "./auth-shelter.service";
import { CheckShelterDto } from "./dto/check-shelter.dto";
import { Response } from "express";
import { CreateShelterDto } from "../shelters/dto/create-shelter.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { editFileName, imageFileFilter } from "../utils/file-upload.utils";

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
    const photoPath = `${process.env.SERVER_URL}/shelter-scan/${image.filename}`
    const shelterData = await this.authService.registration(shelterDto, photoPath)
    response.cookie('refreshToken-shelter',
      shelterData,
      {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
    // TODO if will https - add secure: true
    console.log('shelterData', shelterData);
    return response.json(shelterData)
  }


  @UsePipes(ValidationPipe)
  @Post('/check')
  async checkEmail(@Body() userDto: CheckShelterDto) {
    return await this.authService.checkEmail(userDto)
  }
}
