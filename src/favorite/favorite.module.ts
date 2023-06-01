import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Favorites, FavoritesSchema } from "./favorite-item.schema";
import {FavoriteService} from "./favorite.service";

@Module({
  controllers: [],
  providers: [FavoriteService],
  imports: [
    MongooseModule.forFeature([
      {name: Favorites.name, schema: FavoritesSchema}
    ]),
  ],
  exports: [
    FavoriteService,
  ]
})
export class FavoriteModule {}
