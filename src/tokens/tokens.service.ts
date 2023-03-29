import { Injectable } from '@nestjs/common';
import { GenerateTokensDto } from "../auth/dto/generate-tokens.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TokensService {
  constructor(private jwtService: JwtService) {
  }

  async generateTokens(user: GenerateTokensDto) {
    const accessToken = this.jwtService.sign(
      user,
      {
        expiresIn: '30m',
        privateKey: process.env.JWT_ACCESS_SECRET,

      }
    )

    const refreshToken = this.jwtService.sign(
      user,
      {
        expiresIn: '30d',
        privateKey: process.env.JWT_REFRESH_SECRET,

      }
    )
    return {
      accessToken,
      refreshToken
    }
  }

  async saveToken() {

  }
}
