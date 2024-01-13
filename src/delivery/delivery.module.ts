import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { City, CitySchema, Delivery, DeliverySchema } from "./delivery.schema";
import {Shelter, ShelterSchema} from "../shelters/shelters.schema";

@Module({
  providers: [DeliveryService],
  controllers: [DeliveryController],
  imports: [
    MongooseModule.forFeature([
      { name: Delivery.name, schema: DeliverySchema },
      { name: City.name, schema: CitySchema },
      {name: Shelter.name, schema: ShelterSchema},
      {name: Shelter.name, schema: ShelterSchema},
    ]),
  ]
})
export class DeliveryModule {}
