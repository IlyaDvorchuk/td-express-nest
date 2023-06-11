import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ActivateMailDto } from "./dto/activate-mail.dto";
import { MailerService } from "@nestjs-modules/mailer";
import { UsersService } from "../users/users.service";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService,
              private userService: UsersService) {
  }

  async activateMail(dto: ActivateMailDto) {
    const candidate = await this.userService.getUserByEmail(dto.email)
    if (candidate) {
      throw new HttpException(
        'Пользователь с таким email существет',
        HttpStatus.BAD_REQUEST
      )
    }
    const randomCode = Math.random().toString().slice(-6)
    console.log('ActivateMailDto', dto);
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
