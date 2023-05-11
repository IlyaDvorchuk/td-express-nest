import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type GoodDocument = HydratedDocument<Good>

@Schema({timestamps: true})
export class Good {

  @Prop({required: true, unique: true})
  title: string

  @Prop({required: true})
  content: string

  @Prop({required: true})
  image: string[]
}

export const GoodSchema = SchemaFactory.createForClass(Good)