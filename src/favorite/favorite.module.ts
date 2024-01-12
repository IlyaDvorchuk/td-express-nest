import {Module} from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Favorites, FavoritesSchema } from "./favorite-item.schema";
import {FavoriteService} from "./favorite.service";
import { ProductCardsModule } from "../productCard/productCard.module";

@Module({
  controllers: [],
  providers: [FavoriteService],
  imports: [
    ProductCardsModule,
    MongooseModule.forFeature([
      {name: Favorites.name, schema: FavoritesSchema}
    ]),
  ],
  exports: [
    FavoriteService,
  ]
})
export class FavoriteModule {}
