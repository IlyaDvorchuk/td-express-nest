import { Body, Controller, Post } from "@nestjs/common";
import { ActivateMailDto } from "./dto/activate-mail.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { MailService } from "./mail.service";

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {
  }

  @ApiOperation({summary: 'Отправка активационного кода'})
  @ApiResponse({status: 200, type: '545765'})
  @Post()
  async activateMail(@Body() dto: ActivateMailDto) {
    return this.mailService.activateMail(dto)
  }
}
