import mongoose, { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Subcategory } from "./subcategories.schema";
import { ProductCard } from "../../productCard/productCard.schema";

export type CategoryDocument = HydratedDocument<Category>

@Schema({timestamps: true})
export class Category {
  @Prop({type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subcategory" }]})
  children: Subcategory[]

  @Prop({required: true, unique: true})
  name: string

  @Prop({unique: true})
  icon: string

  @Prop({required: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProductCard" }]})
  productCards: ProductCard[]


}

export const CategorySchema = SchemaFactory.createForClass(Category)
