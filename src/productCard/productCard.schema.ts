import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PointIssue } from "../shelters/shelters.schema";
import { NotificationDocument, NotificationSchema } from 'src/notification/notification.schema';

@Schema()
export class Category extends Document {
  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  subcategory: string;

  @Prop()
  section: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

@Schema()
export class Information extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;
}

export const InformationSchema = SchemaFactory.createForClass(Information);

@Schema()
export class AdditionalInformation extends Document {
  @Prop({ required: true })
  material: string;

  @Prop({ required: true })
  recommendations: string;
}

export const AdditionalInformationSchema = SchemaFactory.createForClass(AdditionalInformation);

@Schema()
export class PricesAndQuantity extends Document {
  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  priceBeforeDiscount: number;

  @Prop({ required: true })
  quantity: number;
}

export const PricesAndQuantitySchema = SchemaFactory.createForClass(PricesAndQuantity);

@Schema()
export class Dimensions extends Document {
  @Prop({ required: true })
  length: number;

  @Prop({ required: true })
  width: number;

  @Prop({ required: true })
  height: number;

  @Prop({ required: true })
  weight: number;
}

export const DimensionsSchema = SchemaFactory.createForClass(Dimensions);

@Schema()
export class DeliveryPoint extends Document {
  @Prop({ required: true })
  objectId: string;
}

export const DeliveryPointSchema = SchemaFactory.createForClass(DeliveryPoint);

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ required: true })
  productId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  content: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

// @Schema()
// export class ProductStatus extends Document {
//   @Prop({ required: true })
//   name: string;
// }

// export const ProductStatusSchema = SchemaFactory.createForClass(ProductStatus);


@Schema({ timestamps: true })
export class ProductCard extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Shelter' })
  shelterId: string;

  @Prop({ type: CategorySchema, required: true })
  categories: Category;

  @Prop({ type: InformationSchema, required: true })
  information: Information;

  @Prop({ required: true })
  mainPhoto: string;

  @Prop({ type: [String], required: true })
  additionalPhotos: string[];

  @Prop({ type: AdditionalInformationSchema, required: true })
  additionalInformation: AdditionalInformation;

  @Prop({ type: PricesAndQuantitySchema, required: true })
  pricesAndQuantity: PricesAndQuantity;

  @Prop({ type: DimensionsSchema, required: true })
  dimensions: Dimensions;

  @Prop({ type: Number, default: 0 })
  viewsCount: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PointIssue' }] })
  deliveryPoints: PointIssue[];

   @Prop({ type: [CommentSchema], default: [] })
  comments: Comment[];

  @Prop({ type: Boolean, default: false })
  published: boolean;

  @Prop({ type: [NotificationSchema], default: [] })
  notifications: NotificationDocument[];

  @Prop({ type: Number, default: 0 }) //куоличество покупок
purchaseCount: number;


  // @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'ProductStatus' })
  // status: ProductStatus;
}
export const ProductCardSchema = SchemaFactory.createForClass(ProductCard);
