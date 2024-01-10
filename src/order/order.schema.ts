import mongoose, { Document, HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {Shelter} from "../shelters/shelters.schema";

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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;
}

export const DeliveryAddressSchema = SchemaFactory.createForClass(DeliveryAddress)


@Schema()
export class OrderType extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ProductCard', required: true })
  goodId: string;

  @Prop({ required: true })
  goodName: string;

  @Prop({ required: true })
  goodPhoto: string;


  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'SizeQuantity', required: true })
  typeId: string;

  @Prop({required: true})
  count: number

  @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'Shelter', required: true})
  shelterId: string;

  @Prop({required: true})
  price: number

}

export const OrderTypeSchema = SchemaFactory.createForClass(OrderType)

export type OrderDocument = HydratedDocument<Order>

@Schema({ timestamps: true })
export class Order {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({  type: [OrderTypeSchema] , required: true})
  orderTypes: OrderType[];

  @Prop({ type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Shelter'}] , required: true})
  shelterIds: Shelter[];


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

  @Prop({ required: false, default: '' })
  city: string;

  @Prop({required: true})
  orderId: string

  @Prop({default: true})
  isTdMarket: boolean
}

export const OrderSchema = SchemaFactory.createForClass(Order);
