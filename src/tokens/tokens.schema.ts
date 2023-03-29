import mongoose, { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "../users/users.schema";

export type TokenDocument = HydratedDocument<Token>

@Schema({timestamps: true})
export class Token {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  user: User

  @Prop({required: true})
  refreshToken: string
}

export const TokenSchema = SchemaFactory.createForClass(Token)