import { Body, Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { GoodsService } from "./goods.service";
import { CreateGoodDto } from "./dto/create-good.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('goods')
export class GoodsController {
  constructor(private goodService: GoodsService) {
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createPost(@Body() dto: CreateGoodDto,
              @UploadedFiles() image) {
      return this.goodService.create(dto, image)
  }
}
