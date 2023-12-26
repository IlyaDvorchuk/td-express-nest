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
      let candidate;
      if (dto.isShelter) {

      } else {
        candidate = await this.shelterService.getShelterByEmail(dto.email);
      }
      if (candidate) {
        throw new HttpException(
            'Пользователь с таким email существет',
            HttpStatus.BAD_REQUEST
        );
      }
    }

    const randomCode = Math.random().toString().slice(-6);
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="ru">
    <body style="color: black; font-family: 'Roboto', sans-serif;">
        <header style="margin-bottom: 40px;">
            <h1 style="text-align: center; color: #fff; font-family: 'Courier New', Courier, monospace;">Подтверждение аккаунта td-market</h1>
        </header>
        
        <p style="text-align: center; color: #fff; font-family: 'Courier New', Courier, monospace; font-size: larger;">
            Ваш код авторизации: <span style="font-weight: 900;">${randomCode}</span>
        </p>
        
        <p style="text-align: center; color: #fff; font-family: 'Courier New', Courier, monospace;">
            Введите данный код для подтверждения вашего аккаунта и постарайтесь никому его не сообщать)
        </p>
        
        <div style="font-family: 'Courier New', Courier, monospace; color: #fff; font-size: 14px; padding-left: 10px">
            Можете распространять код, это ваше право. Выбор между подчинением инструкциям и защитой принципов — ваш. Ваши решения — ваше право, и никто не имеет право указывать вами, что делать. Это ваш выбор, и ваше право на него неоспоримо.🦧
        </div>
        
        <div style="font-family: 'Courier New', Courier, monospace; color: #fff;">
            Цитата:<span style="font-weight: 900;">Chat gpt4</span>
        </div>
        
        <p style="text-align: center; color: #fff; font-family: 'Courier New', Courier, monospace;">
            Удачных покупок на td-market
        </p>
    </body>
</html>
    `;

    await this.mailerService.sendMail({
      from: process.env.SMTP_USER,
      to: dto.email,
      subject: 'Активация аккаунта на TD-Market',
      text: '',  // Укажите пустую строку, так как мы используем HTML
      html: htmlTemplate,  // Передаем HTML-код шаблона
    });

    return randomCode;
  }
}
