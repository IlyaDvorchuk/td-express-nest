import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PricesAndQuantity, ProductCard } from './productCard.schema';
import { CreateProductCardDto } from './dto/create-product-card.dto';
import { SheltersService } from "../shelters/shelters.service";
import { CategoriesService } from "../categories/categories.service";

@Injectable()
export class ProductCardService {
    constructor(
        @InjectModel(ProductCard.name) private productCardRepository: Model<ProductCard>,
        private shelterService: SheltersService,
        private categoriesService: CategoriesService,
    ) { }

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
            if (typeof dto[field] === 'string') {
                try {
                    dto[field] = JSON.parse(dto[field]);
                } catch (error) {
                    // Handle JSON parse error
                    throw new HttpException(
                        'Ошибка при разборе JSON',
                        HttpStatus.BAD_REQUEST
                    );
                }
            }
        }

        const product = await this.productCardRepository.create({
            ...dto,
            shelterId,
            mainPhoto,
            additionalPhotos,
            viewsCount: 0,
            pricesAndQuantity: new PricesAndQuantity(), // Инициализируем поле pricesAndQuantity новым экземпляром класса PricesAndQuantity
          });

        const isAddInShelter = await this.shelterService.addProductCard(shelterId, product._id);
        const isAddInCategories = await this.categoriesService.addProductCard(dto.categories, product._id);

        if (isAddInShelter && isAddInCategories) {
            return product;
        } else {
            throw new HttpException(
                'Не сохранились данные',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
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


    async getNewProductCards(page: number, limit: number) {
        const skip = (page - 1) * limit;

        const totalCount = await this.productCardRepository.countDocuments();
        const totalPages = Math.ceil(totalCount / limit);


        const productCards = await this.productCardRepository
            .find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();

        return {
            productCards,
            totalPages,
            currentPage: page,
        };
    }

    async getProductCardSummary(id: string) {
        return this.productCardRepository.findById(id)
            .select('information.name information.description pricesAndQuantity')
            .exec();
    }

    async getProductCardDetails(id: string) {
        return this.productCardRepository.findById(id).exec();
    }

    async addViewToProductCard(id: string) {
        return this.productCardRepository.findByIdAndUpdate(id, { $inc: { viewsCount: 1 } }, { new: true }).exec();
    }

    async getAllProductCards(page: number, limit: number) {
        const skip = (page - 1) * limit;
        const totalCount = await this.productCardRepository.countDocuments();
        const totalPages = Math.ceil(totalCount / limit);

        const productCards = await this.productCardRepository.find()
            .skip(skip)
            .limit(limit)
            .exec();

        return {
            productCards,
            totalPages,
            currentPage: page,
        };
    }

    async getHotOffers(page: number, limit: number) {
        const skip = (page - 1) * limit;

        const totalCount = await this.productCardRepository.countDocuments();
        const totalPages = Math.ceil(totalCount / limit);

        const hotOffers = await this.productCardRepository
            .find()
            .sort({ viewsCount: -1 })
            .skip(skip)
            .limit(limit)
            .exec();

        return {
            productCards: hotOffers,
            totalPages,
            currentPage: page,
        };
    }


  async applyDiscountToProductCard(id: string, discount: number) {
    const product = await this.productCardRepository.findById(id).exec();

    if (!product) {
      throw new HttpException('Карточка продукта не найдена', HttpStatus.NOT_FOUND);
    }

    product.pricesAndQuantity.priceBeforeDiscount = product.pricesAndQuantity.price; // Сохраняем текущую цену в поле priceBeforeDiscount
    product.pricesAndQuantity.price = product.pricesAndQuantity.price * (1 - discount / 100); // Применяем скидку

    return product.save();
  }

  async getDiscountedProductCards(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const totalCount = await this.productCardRepository.countDocuments({ 'pricesAndQuantity.price': { $lt: 'pricesAndQuantity.priceBeforeDiscount' } });
    const totalPages = Math.ceil(totalCount / limit);

    const discountedProductCards = await this.productCardRepository
      .find({ 'pricesAndQuantity.price': { $lt: 'pricesAndQuantity.priceBeforeDiscount' } })
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      discountedProductCards,
      totalPages,
      currentPage: page,
    };
  }
}
