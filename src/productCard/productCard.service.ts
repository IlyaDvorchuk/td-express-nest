import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductCard } from './productCard.schema';
import { CreateProductCardDto } from './dto/create-product-card.dto';
import { SheltersService } from "../shelters/shelters.service";
import { CategoriesService } from "../categories/categories.service";

@Injectable()
export class ProductCardService {
  constructor(
    @InjectModel(ProductCard.name) private productCardRepository: Model<ProductCard>,
      private shelterService: SheltersService,
      private categoriesService: CategoriesService,
  ) {}

  async getProductCardById(id: string) {
    return this.productCardRepository.findById(id).exec();
  }

  async createProductCard(
    dto: CreateProductCardDto,
    shelterId: string,
    mainPhoto: string,
    additionalPhotos: string[]
  ) {

    for (let field of Object.keys(dto)) {
      if (field === 'categories'
          || field === 'information'
          || field === 'dimensions'
          || field === 'pricesAndQuantity'
          || field === 'additionalInformation'
          || field === 'deliveryPoints'
      ) {
        // @ts-ignore
        dto[field] = JSON.parse(dto[field])
      }
    }


    const product = await this.productCardRepository.create({
      ...dto,
      shelterId,
      mainPhoto,
      additionalPhotos
    })

    const isAddInShelter = await this.shelterService.addProductCard(shelterId, product._id)

    const isAddInCategories = await this.categoriesService.addProductCard(dto.categories, product._id)

    if (isAddInShelter && isAddInCategories) {
      return product
    } else {
      throw new HttpException(
        'Не сохранились данные',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  // private saveImage(file: Express.Multer.File): string {
  //   const imageId = uuidv4();
  //   const fileName = `${imageId}-${file.originalname}`;
  //   const filePath = join(
  //     './static/shelter-scans',
  //     fileName
  //   );
  //   return filePath;
  // }

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
