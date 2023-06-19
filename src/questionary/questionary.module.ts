import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from './questionary.schema';
import { QuestionaryService } from "./questionary.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema }
    ])
  ],
  providers: [QuestionaryService],
  exports: [QuestionaryService]
})
export class QuestionModule {}
