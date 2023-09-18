import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type ColorDocument = HydratedDocument<Color>

@Schema()
export class Color {
  @Prop({required: true, unique: true})
  name: string

  @Prop({required: true, unique: true})
  color: string
}

export const ColorSchema = SchemaFactory.createForClass(Color)
