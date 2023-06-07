import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Comment, CommentSchema, ProductCard, ProductCardSchema } from "./productCard.schema";
import { ProductCardController } from './productCard.controller';
import { ProductCardService } from './productCard.service';
import { JwtStrategy } from '../utils/jwt.strategy';
import { CategoriesModule } from "../categories/categories.module";
import { Comment, CommentSchema } from './productCard.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductCard.name, schema: ProductCardSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    PassportModule,
    CategoriesModule,
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
export class ProductCardsModule {}
