import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { SheltersService } from "../shelters/shelters.service";
import {UsersService} from "../users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly shelterService: SheltersService,
              private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.PRIVATE_KEY || 'SECRET',
    });
  }

  async validate(payload) {

    let user
    console.log('hey bro', payload)

    if (payload.user === 'user') {
      user = await this.userService.findById(payload.sub);

    } else if (payload.user === 'shelter') {
      user =  await this.shelterService.findById(payload.sub);


    }
    if (!user) {
      throw new UnauthorizedException('Не существует такого пользователя');
    }

    return user;
  }
}
