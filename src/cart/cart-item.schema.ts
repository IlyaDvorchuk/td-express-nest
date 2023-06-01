import mongoose, { HydratedDocument, Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ProductCard } from "../productCard/productCard.schema";

export type CartItemDocument = CartItem & Document;

@Schema()
export class CartItem {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'ProductCard' })
  productId: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  totalPrice: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

export type CartDocument = HydratedDocument<Cart>;

@Schema()
export class Cart {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  userId: string;

  @Prop({ type: [CartItemSchema], default: [] })
  items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
