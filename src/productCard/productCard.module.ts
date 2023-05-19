import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ProductCard, ProductCardSchema } from './productCard.schema';
import { ProductCardController } from './productCard.controller';
import { ProductCardService } from './productCard.service';
import { JwtStrategy } from '../utils/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductCard.name, schema: ProductCardSchema },
    ]),
    PassportModule,
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
