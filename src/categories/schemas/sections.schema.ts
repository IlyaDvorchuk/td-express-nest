import mongoose, { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Subcategory } from "./subcategories.schema";

export type SectionDocument = HydratedDocument<Section>

@Schema({timestamps: true})
export class Section {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: "Subcategory", required: true})
  parent: Subcategory

  @Prop({required: true})
  name: string

  // @Prop({required: true})
  // sections: string[]
}

export const SectionSchema = SchemaFactory.createForClass(Section)