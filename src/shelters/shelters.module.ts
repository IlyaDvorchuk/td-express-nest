import { Module } from '@nestjs/common';
import { SheltersController } from './shelters.controller';
import { SheltersService } from './shelters.service';
import { MongooseModule } from "@nestjs/mongoose";
import { Shelter, ShelterSchema } from "./shelters.schema";

@Module({
  controllers: [SheltersController],
  providers: [SheltersService],
  imports: [
    MongooseModule.forFeature([
      {name: Shelter.name, schema: ShelterSchema}
    ]),
  ]
})
export class SheltersModule {}
