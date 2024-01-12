import {forwardRef, MiddlewareConsumer, Module} from "@nestjs/common";
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
import {MulterModule} from "@nestjs/platform-express";
import {FavoriteModule} from "../favorite/favorite.module";
import {Favorites, FavoritesSchema} from "../favorite/favorite-item.schema";


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductCard.name, schema: ProductCardSchema },
      { name: TypeQuantity.name, schema: TypeQuantitySchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Favorites.name, schema: FavoritesSchema },
    ]),
    PassportModule,
    CategoriesModule,
    QuestionModule,
    forwardRef(() =>  FavoriteModule),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24d',
      },
    }),
    MulterModule.register({
      dest: './static', // указываете папку для сохранения загруженных файлов
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
