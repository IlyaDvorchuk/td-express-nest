import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProductCardService } from './productCard.service';
import { CreateProductCardDto } from './dto/create-product-card.dto';

@Controller('product-cards')
export class ProductCardController {
  constructor(private readonly productCardService: ProductCardService) {}

  @Get(':id')
  async getProductCardById(@Param('id') id: string) {
    return this.productCardService.getProductCardById(id);
  }

  @Post()
  async createProductCard(@Body() createProductCardDto: CreateProductCardDto) {
    return this.productCardService.createProductCard(createProductCardDto);
  }

  @Put(':id')
  async updateProductCard(@Param('id') id: string, @Body() updateProductCardDto: CreateProductCardDto) {
    return this.productCardService.updateProductCard(id, updateProductCardDto);
  }

  @Delete(':id')
  async deleteProductCard(@Param('id') id: string) {
    return this.productCardService.deleteProductCard(id);
  }
}
