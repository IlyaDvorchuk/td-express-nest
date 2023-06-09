import mongoose, { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Category } from "./categories.schema";
import { Section } from "./sections.schema";

export type SubcategoryDocument = HydratedDocument<Subcategory>

@Schema({timestamps: true})
export class Subcategory {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true})
  parent: Category

  @Prop({type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Section" }]})
  children: Section[]

  @Prop({required: true})
  name: string

  // @Prop({required: true})
  // sections: string[]
}

export const SubcategorySchema = SchemaFactory.createForClass(Subcategory)