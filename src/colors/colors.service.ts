import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Color, ColorDocument } from "./color.schema";
import { ColorsDto } from "./dro/colors.dto";

@Injectable()
export class ColorsService {
  constructor(@InjectModel(Color.name) private colorRepository: Model<ColorDocument>,) {
  }

  async createColors(colors: ColorsDto[]) {
    try {
      for (let i = 0; i < colors.length; i++) {
        await this.colorRepository.create(colors)
      }
      return true
    } catch (e) {
      console.error('error', e.message);
    }
  }

  async getColors() {
    return this.colorRepository.find()
  }
}
