import { MiddlewareConsumer, Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import {
  Comment,
  CommentSchema,
  ProductCard,
  ProductCardSchema,
  TypeQuantity,
  TypeQuantitySchema
} from "./productCard.schema";
import { ProductCardController } from './productCard.controller';
import { ProductCardService } from './productCard.service';
import { JwtStrategy } from '../utils/jwt.strategy';
import { CategoriesModule } from "../categories/categories.module";
import { QuestionModule } from 'src/questionary/questionary.module';
import { ProductIdMiddleware } from "../middlewares/randonUuid.middleware";


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductCard.name, schema: ProductCardSchema },
      { name: TypeQuantity.name, schema: TypeQuantitySchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    PassportModule,
    CategoriesModule,
    QuestionModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24d',
      },
    }),
  ],
  controllers: [ProductCardController],
  providers: [ProductCardService, JwtStrategy],
  exports: [ProductCardService],
})
export class ProductCardsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ProductIdMiddleware)
      .forRoutes('/product-cards'); // Замените 'your-route' на свой путь, к которому вы хотите применить middleware
  }
}
