import { Body, Controller, Get, Post } from "@nestjs/common";
import { ColorsService } from "./colors.service";
import { ChildrenColorsDto, ColorsDto } from "./dto/colors.dto";

@Controller('colors')
export class ColorsController {

  constructor(private colorsService: ColorsService) {
  }

  @Post()
  async createColors(@Body() colors: ColorsDto[]) {
    return this.colorsService.createColors(colors)
  }

  @Post('/children')
  async getChildrenColors(@Body() colors: ChildrenColorsDto[]) {
    return this.colorsService.createChildrenColors(colors)
  }

  @Get()
  async getColors() {
    return this.colorsService.getColors()
  }
}
