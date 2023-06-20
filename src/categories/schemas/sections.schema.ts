import mongoose, { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Subcategory } from "./subcategories.schema";
import { ProductCard } from "../../productCard/productCard.schema";
import { Category } from "./categories.schema";

export type SectionDocument = HydratedDocument<Section>

@Schema({timestamps: true})
export class Section {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: "Subcategory", required: true})
  parent: Subcategory

  @Prop({required: true})
  name: string

  @Prop({required: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProductCard" }]})
  productCards: ProductCard[]

  @Prop({required: true})
  parentName: string

  @Prop({required: true})
  categoryName: string

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true})
  categoryParent: Category

  @Prop({required: true})
  type: 'section'
}

export const SectionSchema = SchemaFactory.createForClass(Section)
