import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';

export type CityDocument = HydratedDocument<City>
@Schema()
export class City extends Document {
  @Prop({required: true})
  city: string

  @Prop({required: true})
  price: string
}

export const CitySchema = SchemaFactory.createForClass(City)

export type DeliveryDocument = HydratedDocument<Delivery>;
@Schema({ timestamps: true })
export class Delivery extends Document  {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Shelter' })
  shelterId: mongoose.Schema.Types.ObjectId;

  @Prop({required: false, default: [], type: [CitySchema]})
  cities: City[]
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery);
