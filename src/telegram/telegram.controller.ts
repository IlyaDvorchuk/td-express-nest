import { Controller, Get } from "@nestjs/common";

@Controller('telegram')
export class TelegramController {
  constructor() {
  }

  @Get()
  getTelegram() {
    return Math.random() > 0.5
  }
}