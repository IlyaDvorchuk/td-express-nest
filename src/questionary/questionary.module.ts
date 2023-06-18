import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductCardsModule } from "../productCard/productCard.module";
import { Question, QuestionSchema } from './questionary.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
    ]),
    ProductCardsModule,
  ]
})
export class QuestionModule {}
