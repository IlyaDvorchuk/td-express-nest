import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

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
}

export const UserSchema = SchemaFactory.createForClass(User)
