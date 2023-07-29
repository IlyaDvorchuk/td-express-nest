import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ActivateMailDto } from "./dto/activate-mail.dto";
import { MailerService } from "@nestjs-modules/mailer";
import { UsersService } from "../users/users.service";
import {SheltersService} from "../shelters/shelters.service";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService,
              private userService: UsersService,
              private shelterService: SheltersService
              ) {
  }

  async activateMail(dto: ActivateMailDto) {
    console.log('ActivateMailDto', dto);
    if (!dto?.isNotExamination) {
      let candidate
      if (dto.isShelter) {

      } else {
        candidate = await this.shelterService.getShelterByEmail(dto.email)
      }
      if (candidate) {

        throw new HttpException(
            'Пользователь с таким email существет',
            HttpStatus.BAD_REQUEST
        )
      }
    }

    const randomCode = Math.random().toString().slice(-6)
    await this.mailerService.sendMail({
      from: process.env.SMTP_USER,
      to: dto.email,
      subject: 'Активация аккаунта на TD-Market',
      text: '',
      template: './confirmation',
      context: {
        randomCode
      }
    })
    return randomCode
  }
}
