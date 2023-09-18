import { Body, Controller, Get, Post } from "@nestjs/common";
import { ColorsService } from "./colors.service";
import { ColorsDto } from "./dro/colors.dto";

@Controller('colors')
export class ColorsController {

  constructor(private colorsService: ColorsService) {
  }

  @Post()
  async createColors(@Body() colors: ColorsDto[]) {
    return this.colorsService.createColors(colors)
  }

  @Get()
  async getColors() {
    return this.colorsService.getColors()
  }
}
