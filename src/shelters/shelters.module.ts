import {Global, Module} from '@nestjs/common';
import { SheltersController } from './shelters.controller';
import { SheltersService } from './shelters.service';
import { MongooseModule } from "@nestjs/mongoose";
import { Shelter, ShelterSchema } from "./shelters.schema";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "../utils/jwt.strategy";

@Global()
@Module({
  controllers: [SheltersController],
  providers: [SheltersService, JwtStrategy],
  imports: [
    MongooseModule.forFeature([
      {name: Shelter.name, schema: ShelterSchema},
    ]),
    PassportModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24d'
      }
    }),
  ],
  exports: [SheltersService]
})
export class SheltersModule {}
