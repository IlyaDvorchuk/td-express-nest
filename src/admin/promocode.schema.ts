import {HydratedDocument} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

export type PromocodeDocument = HydratedDocument<Promocode>

@Schema({ timestamps: true })
export class Promocode {
  @Prop({ required: true })
  promocode: string;
}

export const PromocodeSchema = SchemaFactory.createForClass(Promocode);