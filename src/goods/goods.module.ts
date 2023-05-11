import { Module } from '@nestjs/common';
import { GoodsService } from './goods.service';
import { GoodsController } from './goods.controller';
import { FilesModule } from "../files/files.module";

@Module({
  providers: [GoodsService],
  controllers: [GoodsController],
  imports: [
    FilesModule
  ]
})
export class GoodsModule {}
