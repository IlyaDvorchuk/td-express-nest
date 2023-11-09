import mongoose, { Document, HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Buyer extends Document {
  @Prop({required: true})
  family: string

  @Prop({required: true})
  name: string

  @Prop({required: true})
  phone: string
}

export const BuyerSchema = SchemaFactory.createForClass(Buyer)

@Schema()
export class DeliveryAddress extends Document {
  @Prop({required: true})
  street: string

  @Prop({required: true})
  house: string

  @Prop({default: ''})
  entrance: string

  @Prop({default: ''})
  floor: string

  @Prop({default: ''})
  apartment: string

  @Prop({default: ''})
  comment: string

  @Prop({required: true})
  deliveryPrice: number
}

export const DeliveryAddressSchema = SchemaFactory.createForClass(DeliveryAddress)

export type OrderDocument = HydratedDocument<Order>

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ProductCard', required: true })
  goodId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'SizeQuantity', required: true })
  typeId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Shelter' , required: true})
  shelterId: string;

  @Prop({ required: true })
  goodName: string;

  @Prop({ required: true })
  goodPhoto: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  deliveryMethod: 'pickup' | 'express' | 'doorstep';

  @Prop({type: BuyerSchema, required: true})
  buyer: Buyer

  @Prop({ required: true })
  paymentMethod: 'card' | 'qr-code' | 'cash'

  @Prop({type: DeliveryAddressSchema, required: false, default: null})
  deliveryAddress: DeliveryAddress | null

  @Prop({required: true})
  price: number

  @Prop({required: true})
  count: number

  @Prop({ required: false, default: '' })
  city: string;

  @Prop({required: true})
  orderId: string
}

export const OrderSchema = SchemaFactory.createForClass(Order);
