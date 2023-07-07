import {Global, Module, forwardRef} from '@nestjs/common';
import { SheltersController } from './shelters.controller';
import { SheltersService } from './shelters.service';
import { MongooseModule } from "@nestjs/mongoose";
import { Shelter, ShelterSchema } from "./shelters.schema";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "../utils/jwt.strategy";
import { ProductCard, ProductCardSchema } from 'src/productCard/productCard.schema';
import { Order, OrderSchema } from 'src/order/order.schema';
import { User, UserSchema } from 'src/users/users.schema';

@Global()
@Module({
  controllers: [SheltersController],
  providers: [SheltersService, JwtStrategy],
  imports: [
    MongooseModule.forFeature([
      {name: Shelter.name, schema: ShelterSchema},
      { name: ProductCard.name, schema: ProductCardSchema },
      { name: Order.name, schema: OrderSchema },
      { name: User.name, schema: UserSchema },
    ]),    
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24d'
      }
    })
  ], 
  exports: [SheltersService]
})
export class SheltersModule {}
