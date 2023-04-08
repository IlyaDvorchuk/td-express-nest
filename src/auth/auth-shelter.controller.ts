import { Body, Controller, Post, Res, UploadedFiles, UsePipes } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ValidationPipe } from "../pipes/validation.pipe";
import { AuthShelterService } from "./auth-shelter.service";
import { CheckShelterDto } from "./dto/check-shelter.dto";
import { Response } from "express";
import { CreateShelterDto } from "../shelters/dto/create-shelter.dto";

@ApiTags('Авторизация продавца')
@Controller('auth-shelter')
export class AuthShelterController {
  constructor(private authService: AuthShelterService) {
  }

  @UsePipes(ValidationPipe)
  @Post('/registration')
  async registration(@Body() shelterDto: CreateShelterDto,
                     @UploadedFiles() image,
                     @Res() response: Response) {
    console.log('shelterDto', shelterDto);
    const shelterData = await this.authService.registration(shelterDto, image)
    response.cookie('refreshToken-shelter',
      shelterData,
      {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
    // TODO if will https - add secure: true
    return response.json(shelterData)
  }


  @UsePipes(ValidationPipe)
  @Post('/check')
  async checkEmail(@Body() userDto: CheckShelterDto) {
    return await this.authService.checkEmail(userDto)
  }
}
