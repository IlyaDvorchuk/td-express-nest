import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Cart, CartSchema } from "./cart-item.schema";
import { CartService } from "./cart.service";

//корзина
@Module({
  controllers: [],
  providers: [CartService],
  imports: [
    MongooseModule.forFeature([
      {name: Cart.name, schema: CartSchema}
    ]),
  ],
  exports: [CartService]
})
export class CartModule {}
