import { Controller, Get, Post, Put, Delete, Param, Body, Query, UploadedFiles } from '@nestjs/common';
import { ProductCardService } from './productCard.service';
import { CreateProductCardDto } from './dto/create-product-card.dto';
import { UploadedFile } from '@nestjs/common';

@Controller('product-cards')
export class ProductCardController {
  constructor(private readonly productCardService: ProductCardService) {}

  @Get(':id')
  async getProductCardById(@Param('id') id: string) {
    return this.productCardService.getProductCardById(id);
  }

  @Post()
  async createProductCard(
    @Body() createProductCardDto: CreateProductCardDto,
    @UploadedFile() mainPhoto: Express.Multer.File,
    @UploadedFiles() additionalPhotos: Express.Multer.File[]
  ) {
    return this.productCardService.createProductCard(
      createProductCardDto,
      mainPhoto,
      additionalPhotos
    );
  }

  @Put(':id')
  async updateProductCard(@Param('id') id: string, @Body() updateProductCardDto: CreateProductCardDto) {
    return this.productCardService.updateProductCard(id, updateProductCardDto);
  }

  @Delete(':id')
  async deleteProductCard(@Param('id') id: string) {
    return this.productCardService.deleteProductCard(id);
  }

  @Get()
  async searchProductCards(@Query('query') query: string, @Query('page') page: number, @Query('limit') limit: number) {
    return this.productCardService.searchProductCards(query, page, limit);
  }
}
