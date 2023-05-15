import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductCard } from './productCard.schema';
import { CreateProductCardDto } from './dto/create-product-card.dto';

@Injectable()
export class ProductCardService {
  constructor(
    @InjectModel(ProductCard.name) private productCardRepository: Model<ProductCard>,
  ) {}

  async getProductCardById(id: string) {
    return this.productCardRepository.findById(id).exec();
  }

  async createProductCard(dto: CreateProductCardDto) {
    const newProductCard = new this.productCardRepository(dto);
    return newProductCard.save();
  }

  async updateProductCard(id: string, dto: CreateProductCardDto) {
    return this.productCardRepository.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async deleteProductCard(id: string) {
    return this.productCardRepository.findByIdAndDelete(id).exec();
  }

  async searchProductCards(query: string) {
    const regexQuery = new RegExp(query, 'i');
    return this.productCardRepository.find({
      $or: [
        { 'categories.category': regexQuery },
        { 'categories.subcategory': regexQuery },
        { 'categories.section': regexQuery },
        { 'information.name': regexQuery },
        { 'information.description': regexQuery },
      ],
    }).exec();
  }
}
