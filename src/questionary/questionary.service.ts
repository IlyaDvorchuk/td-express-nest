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

  async answerQuestion(questionId: string, answerText: string) {
    const question = await this.questionRepository.findById(questionId);

    if (!question) {
      throw new Error('Question not found');
    }

    question.answerText = answerText;
    await question.save();

    return question;
  }
  
  async getAllQuestions() {
    return await this.questionRepository.find().exec();
  }

  async getQuestionById(questionId: string) {
    return await this.questionRepository.findById(questionId).exec();
  }

  async getAllAnsweredQuestions() {
    return await this.questionRepository.find({ answerText: { $exists: true } }).exec();
  }

  async getAnswerForQuestion(questionId: string) {
    return await this.questionRepository.findOne({ _id: questionId, answerText: { $exists: true } }).exec();
  }
}