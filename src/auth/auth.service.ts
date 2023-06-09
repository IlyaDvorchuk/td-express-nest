import {HttpException, HttpStatus, Injectable, UnauthorizedException} from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";
import * as bcrypt from 'bcryptjs'
import { EnterUserDto } from "../users/dto/enter-user.dto";
import { TokensService } from "../tokens/tokens.service";
import { SheltersService } from "../shelters/shelters.service";

@Injectable()
export class AuthService {
  constructor(private userService: UsersService,
              private tokensService: TokensService,
              private shelterService: SheltersService) {
  }

  async login(userDto: EnterUserDto) {
    const user = await this.validateUser(userDto)
    const tokens = await this.tokensService.generateTokens({email: user.email, userId: user._id})
    await this.tokensService.saveToken(user._id, tokens.refreshToken)
    return {...tokens, user}
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
    const tokens = await this.tokensService.generateTokens({email: user.email, userId: user._id})
    await this.tokensService.saveToken(user._id, tokens.refreshToken)
    return {...tokens, user}
  }


  // async removeToken(refreshToken: string) {
  //   return await this.jwtService.de
  // }

  private async validateUser(userDto: CreateUserDto | EnterUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email)
    if (!user) {
      throw new UnauthorizedException({message: 'Некорректный емайл или пароль'})
    }
    const passwordEquals = await bcrypt.compare(userDto?.password, user?.passwordHash)
    if (user && passwordEquals) {
      return user
    }
    throw new UnauthorizedException({message: 'Некорректный емайл или пароль'})
  }

  async logout(refreshToken: string) {
    return await this.tokensService.removeToken(refreshToken)
  }

  async checkEmail(userDto: { email: string }) {
    return Boolean(this.userService.getUserByEmail(userDto.email))
  }

  async refresh(refreshToken: string, param?: unknown) {
    if (!refreshToken) {
      throw new UnauthorizedException({message: 'Пользователь не авторизован'})
    }
    const userData = await this.tokensService.validateRefreshToken(refreshToken)
    const tokenFromDb = await this.tokensService.findToken(refreshToken)
    if (!userData || !tokenFromDb) {
      throw new UnauthorizedException({message: 'Пользователь не авторизован'})
    }
    let user
    let tokens
    if (!param) {
      user = await this.userService.getUserByEmail(userData.email)
      tokens = await this.tokensService.generateTokens({email: user.email, userId: user._id})
    } else {
      user = await this.shelterService.getUserByEmail(userData.email)
      tokens = await this.tokensService.generateTokens({email: user.email, userId: user._id})
    }
    await this.tokensService.saveToken(user._id, tokens.refreshToken)
    return {...tokens, user}
  }
}