import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.PRIVATE_KEY || 'SECRET',
    });
  }

  async validate(payload) {

    let user
    // console.log('payload', payload);
    if (payload.user === 'user') {
      return payload.sub
      // user = await this.userService.findById(payload.sub);

    } else if (payload.user === 'shelter') {
      return payload.sub
      // user =  await this.shelterService.findById(payload.sub);
    }
    if (!user) {
      throw new UnauthorizedException('Не существует такого пользователя');
    }
    return user;
  }
}
