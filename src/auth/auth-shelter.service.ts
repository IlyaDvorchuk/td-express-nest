import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { TokensService } from "../tokens/tokens.service";
import { CheckShelterDto } from "./dto/check-shelter.dto";
import { CreateShelterDto } from "../shelters/dto/create-shelter.dto";
import { SheltersService } from "../shelters/shelters.service";
import * as bcrypt from 'bcryptjs'
import { EnterUserDto } from "../users/dto/enter-user.dto";

@Injectable()
export class AuthShelterService {
  constructor(private shelterService: SheltersService,
              private tokensService: TokensService) {
  }


  async checkEmail(userDto: CheckShelterDto) {
    return Promise.resolve(userDto);
  }

  async registration(shelterDto: CreateShelterDto, photoPath: string) {
    const candidate = await this.shelterService.getUserByEmail(shelterDto.email)
    if (candidate) {
      throw new HttpException(
        'Продавец с таким email существет',
        HttpStatus.BAD_REQUEST
      )
    }
    const hashPassword = await bcrypt.hash(shelterDto.password, 5)
    for (let field of Object.keys(shelterDto)) {
      if (field === 'closePerson' || field === 'personalData' || field === 'entity') {
        // @ts-ignore
        shelterDto[field] = JSON.parse(shelterDto[field])
      }
    }
    const shelter = await this.shelterService.createShelter({...shelterDto, password: hashPassword}, photoPath)
    const tokens = await this.tokensService.generateTokens({email: shelter.email, userId: shelter._id})
    await this.tokensService.saveToken(shelter._id, tokens.refreshToken)
    return {...tokens, shelter}
  }

  async login(shelterDto: EnterUserDto) {
    const shelter = await this.validateShelter(shelterDto)
    const tokens = await this.tokensService.generateTokens({email: shelter.email, userId: shelter._id})
    await this.tokensService.saveToken(shelter._id, tokens.refreshToken)
    return {...tokens, shelter}
  }

  private async validateShelter(userDto: EnterUserDto) {
    const shelter = await this.shelterService.getUserByEmail(userDto.email)
    console.log('shelter 51', shelter);
    if (!shelter) {
      throw new UnauthorizedException({message: 'Некорректный емайл или пароль'})
    }
    const passwordEquals = await bcrypt.compare(userDto?.password, shelter?.password)
    if (shelter && passwordEquals) {
      return shelter
    }
    throw new UnauthorizedException({message: 'Некорректный емайл или пароль'})
  }
}

