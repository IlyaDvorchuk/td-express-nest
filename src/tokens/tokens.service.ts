import { Injectable } from '@nestjs/common';
import { GenerateTokensDto } from "../auth/dto/generate-tokens.dto";
import { JwtService } from "@nestjs/jwt";
import { Model } from "mongoose";
import { Token, TokenDocument } from "./tokens.schema";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class TokensService {
  constructor(@InjectModel(Token.name) private tokenRepository: Model<TokenDocument>,
              private jwtService: JwtService) {
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

  async saveToken(userId: any, refreshToken: string) {
    const tokenData = await this.tokenRepository.findOne({user: userId})
    if (tokenData) {
      tokenData.refreshToken = refreshToken
      return tokenData.save()
    }
    return await this.tokenRepository.create({user: userId, refreshToken})
  }

  async removeToken(refreshToken: string) {
    return this.tokenRepository.deleteOne({ refreshToken });
  }
}
