import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Color, ColorDocument } from "./color.schema";
import { ChildrenColorsDto, ColorsDto } from "./dto/colors.dto";

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

  async createChildrenColors(colors: ChildrenColorsDto[]) {
    try {
      for (let i = 0; i < colors.length; i++) {
        const parentColor = await this.colorRepository.findOne({name: colors[i].parentName})

        if (parentColor) {

          const color = await this.colorRepository.create({
            ...colors[i],
            parent: parentColor._id
          })
          console.log('color', color._id);
          // @ts-ignore
          parentColor.children.push(color._id)
          await parentColor.save()
        }
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
