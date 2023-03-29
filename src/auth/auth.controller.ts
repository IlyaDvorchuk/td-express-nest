import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { EnterUserDto } from "../users/dto/enter-user.dto";

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post('/login')
  async login(@Body() userDto: EnterUserDto,
        @Res() response: Response) {
    const userData = await this.authService.login(userDto)
    response.cookie('refreshToken',
      userData,
      {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
    return response.json(userData)
  }

  @Post('/registration')
  async registration(@Body() userDto: CreateUserDto,
               @Res() response: Response) {
    const userData = await this.authService.registration(userDto)
    response.cookie('refreshToken',
      userData,
      {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
    return response.json(userData)
  }

  @Post('/logout')
  async logout(@Body() userDto: CreateUserDto,
                     @Req() request: Request,
                     @Res() response: Response) {
    const {refreshToken} = request.cookies
    const token = await this.authService.logout(refreshToken)
  }

  @Post('/logout')
  async checkEmail(@Body() userDto: {email: string}) {
    return await this.authService.checkEmail(userDto)
  }
}
