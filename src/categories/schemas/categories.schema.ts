import mongoose, { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Subcategory } from "./subcategories.schema";

export type CategoryDocument = HydratedDocument<Category>

@Schema({timestamps: true})
export class Category {
  @Prop({type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subcategory" }]})
  children: Subcategory[]

  @Prop({required: true, unique: true})
  name: string

  @Prop({unique: true})
  icon: string
}

export const CategorySchema = SchemaFactory.createForClass(Category)