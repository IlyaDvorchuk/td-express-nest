import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProductCard } from 'src/productCard/productCard.schema';

export type QuestionDocument = Question & Document;

@Schema()
export class Question {
  @Prop({ type: ProductCard, required: true })
  product: ProductCard;

  @Prop({ required: true })
  customerId: number;

  @Prop({ required: true }) //вопрос продавцу по товару
  questionText: string;

  @Prop() // ответ от продавца
  answerText: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
