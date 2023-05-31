import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class FavoriteItem extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'ProductCard' })
  productId: string;
}

export const FavoriteItemSchema = SchemaFactory.createForClass(FavoriteItem);

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
