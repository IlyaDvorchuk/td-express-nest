import mongoose, { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type ColorDocument = HydratedDocument<Color>

@Schema()
export class Color {
  @Prop({required: true, unique: true})
  name: string

  @Prop({required: true, unique: true})
  color: string

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: "Color", required: false})
  parent: Color | undefined

  @Prop({type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Color" }], default: [], required: false})
  children: Color[] | undefined
}

export const ColorSchema = SchemaFactory.createForClass(Color)
