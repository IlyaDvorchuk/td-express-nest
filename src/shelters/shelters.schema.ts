import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type ShelterDocument = HydratedDocument<Shelter>

@Schema({timestamps: true})
export class Shelter {

  @Prop({required: true})
  name: string

  @Prop({required: true, unique: true})
  phone: string

  @Prop({required: true, unique: true})
  email: string

  @Prop({required: true})
  passwordHash: string
}

export const ShelterSchema = SchemaFactory.createForClass(Shelter)