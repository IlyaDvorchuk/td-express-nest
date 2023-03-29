import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UserDocument = HydratedDocument<User>

@Schema({timestamps: true})
export class User {
  @Prop({required: true})
  firstName: string

  @Prop({required: true})
  secondNane: string

  @Prop({required: true, unique: true})
  email: string

  @Prop({required: true})
  passwordHash: string
}

export const UserSchema = SchemaFactory.createForClass(User)