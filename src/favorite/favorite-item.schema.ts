import mongoose, {Document, HydratedDocument} from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class FavoriteItem extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ProductCard' })
  productId: string;

  @Prop({ type: Boolean, default: false }) //в избранном
  isFavorite: boolean;

  @Prop({ type: Boolean, default: false }) //в корзине
  isCart: boolean;
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
