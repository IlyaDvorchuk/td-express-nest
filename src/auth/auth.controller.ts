import { Body, Controller, Post, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { Response } from "express";

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post('/login')
  login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto)
  }

  @Post('/registration')
  registration(@Body() userDto: CreateUserDto,
               @Res() response: Response) {
    const userData = this.authService.registration(userDto)
    response.cookie('refreshToken',
      userData,
      {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
    return userData
  }
}
