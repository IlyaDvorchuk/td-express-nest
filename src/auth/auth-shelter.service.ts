import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { TokensService } from "../tokens/tokens.service";
import { CheckShelterDto } from "./dto/check-shelter.dto";
import { CreateShelterDto } from "../shelters/dto/create-shelter.dto";
import { SheltersService } from "../shelters/shelters.service";
import * as bcrypt from 'bcryptjs'
import { FilesService } from "../files/files.service";

@Injectable()
export class AuthShelterService {
  constructor(private shelterService: SheltersService,
              private tokensService: TokensService,
              private fileService: FilesService) {
  }


  async checkEmail(userDto: CheckShelterDto) {
    return Promise.resolve(userDto);
  }

  async registration(shelterDto: CreateShelterDto, image) {
    const candidate = await this.shelterService.getUserByEmail(shelterDto.email)
    if (candidate) {
      throw new HttpException(
        'Продавец с таким email существет',
        HttpStatus.BAD_REQUEST
      )
    }
    const hashPassword = await bcrypt.hash(shelterDto.password, 5)
    const fileName = await this.fileService.createFile(image)
    const shelter = await this.shelterService.createShelter({...shelterDto, password: hashPassword}, fileName)
    const tokens = await this.tokensService.generateTokens({email: shelter.email, userId: shelter._id})
    await this.tokensService.saveToken(shelter._id, tokens.refreshToken)
    return {...tokens, shelter}
  }
}