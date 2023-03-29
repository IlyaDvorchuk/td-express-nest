import {HttpException, HttpStatus, Injectable, UnauthorizedException} from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";
import * as bcrypt from 'bcryptjs'
import { EnterUserDto } from "../users/dto/enter-user.dto";
import { TokensService } from "../tokens/tokens.service";

@Injectable()
export class AuthService {
  constructor(private userService: UsersService,
              private tokensService: TokensService) {
  }

  async login(userDto: EnterUserDto) {
    const user = await this.validateUser(userDto)
    return this.tokensService.generateTokens({email: user.email, userId: user.id})
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email)
    if (candidate) {
      throw new HttpException(
        'Пользователь с таким email существет',
          HttpStatus.BAD_REQUEST
        )
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5)
    const user = await this.userService.createUser({...userDto, password: hashPassword})
    return await this.tokensService.generateTokens({email: user.email, userId: user.id})
  }



  // async removeToken(refreshToken: string) {
  //   return await this.jwtService.de
  // }

  private async validateUser(userDto: CreateUserDto | EnterUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email)
    if (!user) {
      throw new UnauthorizedException({message: 'Некорректный емайл или пароль'})
    }
    const passwordEquals = await bcrypt.compare(userDto?.password, user?.password)
    if (user && passwordEquals) {
      return user
    }
    throw new UnauthorizedException({message: 'Некорректный емайл или пароль'})
  }

  async logout(refreshToken: string) {
    // return await
  }

  async checkEmail(userDto: { email: string }) {
    return Boolean(this.userService.getUserByEmail(userDto.email))
  }
}
