import mongoose, {Document, HydratedDocument} from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Cart} from "../cart/cart-item.schema";
import {FavoriteService} from "./favorite.service";

@Schema()
export class FavoriteItem extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ProductCard' })
  productId: string;
}

export const FavoriteItemSchema = SchemaFactory.createForClass(FavoriteItem);

export type FavoritesDocument = HydratedDocument<Favorites>;

@Schema()
export class Favorites extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  userId: string;

  @Prop({ type: [FavoriteItemSchema], default: [] })
  items: FavoriteItem[];
}

export const FavoritesSchema = SchemaFactory.createForClass(Favorites);

export class CreateFavoritesDto {
  productId: string;
}
