import {Injectable} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { TokensService } from "../tokens/tokens.service";
import { CheckShelterDto } from "./dto/check-shelter.dto";

@Injectable()
export class AuthShelterService {
  constructor(private userService: UsersService,
              private tokensService: TokensService) {
  }


  async checkEmail(userDto: CheckShelterDto) {
    return Promise.resolve(undefined);
  }
}