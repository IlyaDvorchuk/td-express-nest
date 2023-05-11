import { Module } from '@nestjs/common';
import { GoodsService } from './goods.service';
import { GoodsController } from './goods.controller';
import { FilesModule } from "../files/files.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Good, GoodSchema } from "./good.schema";

@Module({
  providers: [GoodsService],
  controllers: [GoodsController],
  imports: [
    FilesModule,
    MongooseModule.forFeature([
      {name: Good.name, schema: GoodSchema}
    ]),
  ]
})
export class GoodsModule {}
