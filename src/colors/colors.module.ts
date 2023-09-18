import { Module } from '@nestjs/common';
import { ColorsController } from './colors.controller';
import { ColorsService } from './colors.service';
import { MongooseModule } from "@nestjs/mongoose";
import { Color, ColorSchema } from "./color.schema";

@Module({
  controllers: [ColorsController],
  providers: [ColorsService],
  imports: [
    MongooseModule.forFeature([
      {name: Color.name, schema: ColorSchema},
    ]),
  ],
})
export class ColorsModule {}
