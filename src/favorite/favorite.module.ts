import { Module } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Favorites, FavoritesSchema } from "./favorite-item.schema";
import { CartService } from "../cart/cart.service";

@Module({
  controllers: [],
  providers: [CartService],
  imports: [
    MongooseModule.forFeature([
      {name: Favorites.name, schema: FavoritesSchema}
    ]),
  ],
  exports: [
    UsersService,
  ]
})
export class FavoriteModule {}