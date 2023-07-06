import mongoose, { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Order, OrderSchema } from "src/order/order.schema";


export type UserDocument = HydratedDocument<User>

@Schema({timestamps: true})
export class User {
  @Prop({required: true})
  firstName: string

  @Prop({required: true})
  secondName: string

  @Prop({required: true, unique: true})
  email: string

  @Prop({required: true})
  password: string

  @Prop({ default: false })
  isBaned: boolean;

  @Prop({ default: null })
  banReason: string | null;

  @Prop({ type: [OrderSchema], default: [] })
  orders: Order[];
}

export const UserSchema = SchemaFactory.createForClass(User)
