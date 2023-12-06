import mongoose, {HydratedDocument} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {ProductCard} from "./productCard.schema";

export type ReviewDocument = HydratedDocument<Review>

@Schema()
export class Review {
  @Prop({required: true})
  text: string

  @Prop({required: false})
  rate: number

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  userId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'ProductCard' })
  productId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'SizeQuantity', required: false })
  typeId: string
}

export const ReviewSchema = SchemaFactory.createForClass(Review)
