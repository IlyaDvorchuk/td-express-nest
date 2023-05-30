import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {UsersService} from "../users/users.service";

@Injectable()
export class JwtStrategyUser extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.PRIVATE_KEY || 'SECRET',
        });
    }

    async validate(payload) {
        console.log('hey bro')
        const user = this.userService.findById(payload.sub);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
