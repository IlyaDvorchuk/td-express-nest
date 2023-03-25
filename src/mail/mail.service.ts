import { Injectable } from '@nestjs/common';
import { ActivateMailDto } from "./dto/activate-mail.dto";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {
  }

  async activateMail(dto: ActivateMailDto) {
    const randomCode = Math.random().toString().slice(-6)
    await this.mailerService.sendMail({
      from: process.env.SMTP_USER,
      to: dto.mail,
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
