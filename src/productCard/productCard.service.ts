import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductCard } from './productCard.schema';
import { CreateProductCardDto } from './dto/create-product-card.dto';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductCardService {
  constructor(
    @InjectModel(ProductCard.name) private productCardRepository: Model<ProductCard>,
  ) {}

  async getProductCardById(id: string) {
    return this.productCardRepository.findById(id).exec();
  }

  async createProductCard(
    dto: CreateProductCardDto,
    mainPhoto: Express.Multer.File,
    additionalPhotos: Express.Multer.File[]
  ) {
    const productCardData = {
      ...dto,
      mainPhoto: this.saveImage(mainPhoto),
      additionalPhotos: additionalPhotos.map((photo) => this.saveImage(photo)),
    };
    const newProductCard = new this.productCardRepository(productCardData);
    return newProductCard.save();
  }

  private saveImage(file: Express.Multer.File): string {
    const imageId = uuidv4();
    const fileName = `${imageId}-${file.originalname}`;
    const filePath = join(
      './static/shelter-scans',
      fileName
    );
    return filePath;
  }

  async updateProductCard(id: string, dto: CreateProductCardDto) {
    return this.productCardRepository.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async deleteProductCard(id: string) {
    return this.productCardRepository.findByIdAndDelete(id).exec();
  }

  async searchProductCards(query: string, page: number, limit: number) {
    const regexQuery = new RegExp(query, 'i');
    const skip = (page - 1) * limit;
    const totalCount = await this.productCardRepository.countDocuments({
      $or: [
        { 'categories.category': regexQuery },
        { 'categories.subcategory': regexQuery },
        { 'categories.section': regexQuery },
        { 'information.name': regexQuery },
        { 'information.description': regexQuery },
      ],
    });
    const totalPages = Math.ceil(totalCount / limit);

    const productCards = await this.productCardRepository.find({
      $or: [
        { 'categories.category': regexQuery },
        { 'categories.subcategory': regexQuery },
        { 'categories.section': regexQuery },
        { 'information.name': regexQuery },
        { 'information.description': regexQuery },
      ],
    })
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      productCards,
      totalPages,
      currentPage: page,
    };
  }
}
