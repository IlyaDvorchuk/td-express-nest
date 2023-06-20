import mongoose, { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Category } from "./categories.schema";
import { Section } from "./sections.schema";
import { ProductCard } from "../../productCard/productCard.schema";

export type SubcategoryDocument = HydratedDocument<Subcategory>

@Schema({timestamps: true})
export class Subcategory {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true})
  parent: Category

  @Prop({type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Section" }], default: []})
  children: Section[]

  @Prop({required: true})
  name: string

  @Prop({required: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProductCard" }]})
  productCards: ProductCard[]

  @Prop({required: true})
  parentName: string
}

export const SubcategorySchema = SchemaFactory.createForClass(Subcategory)
