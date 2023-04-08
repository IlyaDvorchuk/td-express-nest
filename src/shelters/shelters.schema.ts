import { HydratedDocument, Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class PersonalData extends Document {
  @Prop({required: true})
  name: string

  @Prop({required: true})
  family: string

  @Prop({required: true})
  patronymic: string

  @Prop({required: true})
  birthday: string
}

export const PersonalDataSchema = SchemaFactory.createForClass(PersonalData)

@Schema()
export class ClosePerson extends Document {
  @Prop({required: true})
  name: string

  @Prop({required: true})
  family: string

  @Prop({required: true})
  patronymic: string

  @Prop({required: true, unique: true})
  phone: string
}

export const ClosePersonSchema = SchemaFactory.createForClass(ClosePerson)

@Schema()
export class Entity extends Document {
  @Prop({required: true})
  isIndividual: boolean

  @Prop({required: true})
  code: string

  @Prop({required: true})
  bic: string

  @Prop({required: true})
  check: string
}

export const EntitySchema = SchemaFactory.createForClass(Entity)

export type ShelterDocument = HydratedDocument<Shelter>

@Schema({timestamps: true})
export class Shelter extends Document {


  @Prop({required: true, unique: true})
  phone: string

  @Prop({required: true, unique: true})
  email: string

  @Prop({required: true})
  password: string

  @Prop({required: true})
  name: string

  @Prop({required: true})
  photo: string

  @Prop({type: PersonalDataSchema, required: true})
  personalData: PersonalData

  @Prop({type: ClosePersonSchema, required: true})
  closePerson: ClosePerson

  @Prop({type: EntitySchema, required: true})
  entity: Entity
}

export const ShelterSchema = SchemaFactory.createForClass(Shelter)

