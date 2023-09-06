import mongoose, { Document, HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Order } from "src/order/order.schema";


export type UserDocument = HydratedDocument<User>

@Schema({timestamps: true})
export class User extends Document {
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

  @Prop({ required: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }], default: [] })
  orders: Order[];

  @Prop({ required: true, enum: ['USER', 'ADMIN'], default: 'USER' })
  role: string;

  @Prop({default: null})
  isPushTelegram: string | null
}

export const UserSchema = SchemaFactory.createForClass(User)
