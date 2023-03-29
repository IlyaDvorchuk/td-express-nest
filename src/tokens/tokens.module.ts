import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { Token, TokenSchema } from "./tokens.schema";

@Module({
  providers: [TokensService],
  exports: [TokensService],
  imports: [
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h'
      }
    }),
    MongooseModule.forFeature([
      {name: Token.name, schema: TokenSchema}
    ]),
  ]
})
export class TokensModule {}
