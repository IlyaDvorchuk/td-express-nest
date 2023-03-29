import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../users/users.model";
import { Role } from "../roles/roles.model";
import { JwtModule } from "@nestjs/jwt";

@Module({
  providers: [TokensService],
  exports: [TokensService],
  imports: [
    SequelizeModule.forFeature([User, Role]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h'
      }
    })
  ]
})
export class TokensModule {}
