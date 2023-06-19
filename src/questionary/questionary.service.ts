import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Question, QuestionDocument } from "./questionary.schema";
import { ProductCard } from "../productCard/productCard.schema";

@Injectable()
export class QuestionaryService {
  constructor(@InjectModel(Question.name) private questionRepository: Model<QuestionDocument>) {
  }

  async createQuestion(product: ProductCard, customerId: number, questionText: string) {
    return await this.questionRepository.create({
      product,
      customerId,
      questionText,
    })
  }
}