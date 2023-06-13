import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductStatus, ProductStatusSchema } from 'src/productCard/productCard.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductStatus.name, schema: ProductStatusSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class ProductStatusesModule {}
