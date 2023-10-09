import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './order.schema';
import { User, UserSchema } from 'src/users/users.schema';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Shelter, ShelterSchema } from "../shelters/shelters.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: User.name, schema: UserSchema },
      { name: Shelter.name, schema: ShelterSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
