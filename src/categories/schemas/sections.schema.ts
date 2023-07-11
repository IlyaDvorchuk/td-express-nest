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

  @Prop()
  name: string

  @Prop({required: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProductCard" }]})
  productCards: ProductCard[]

  @Prop({required: true})
  parentName: string

  @Prop()
  categoryName: string

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true})
  categoryParent: Category

  @Prop({required: true, default: 'section'})
  type: 'section'
}

export const SectionSchema = SchemaFactory.createForClass(Section)
