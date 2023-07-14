import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductCard, Comment } from './productCard.schema';
import {CreateProductCardDto, UpdateProductCardDto} from './dto/create-product-card.dto';
import { SheltersService } from "../shelters/shelters.service";
import { CategoriesService } from "../categories/categories.service";
import moment from "moment";
import { Question } from "src/questionary/questionary.schema";
import { QuestionaryService } from "../questionary/questionary.service";
import * as fs from 'fs';


@Injectable()
export class ProductCardService {
    constructor(
        @InjectModel(ProductCard.name) private productCardRepository: Model<ProductCard>,
        @InjectModel(Comment.name) private commentRepository: Model<Comment>,
        private questionService: QuestionaryService,
        private shelterService: SheltersService,
        private categoriesService: CategoriesService,
    ) { }

    async getProductCardById(id: string): Promise<ProductCard> {
        const query = this.productCardRepository.findOne({ _id: id, published: true });
        return query.exec();
      }

      async getProductCardByUserId(id: string): Promise<ProductCard> {
        const query = this.productCardRepository.findOne({ _id: id, published: true });
        //поиск по избранному и корзине для объединения в общий список

        return query.exec();
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
            // pricesAndQuantity: new PricesAndQuantity(), // Инициализируем поле pricesAndQuantity новым экземпляром класса PricesAndQuantity
          });
        console.log('CreateProductCardDto', product);
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

    async updateProductCard(dto: UpdateProductCardDto): Promise<ProductCard> {
        const query = this.productCardRepository.findOneAndUpdate(
          { _id: id, published: true },
          dto,
          { new: true }
        );
        return query.exec();
      }

    async deleteProductCard(productId: string, shelterId: string): Promise<ProductCard> {
        const productCard = await this.productCardRepository.findOneAndDelete({ _id: productId });
        console.log('deleteProductCard productCard', productCard)
        // Удаление файла mainPhoto
        const mainPhoto = productCard.mainPhoto;
        // const mainPhotoFilename = mainPhoto.substring(mainPhoto.lastIndexOf('/') + 1);
        const mainPhotoFilePath = `./static${mainPhoto}`;
        // console.log('fs', mainPhotoFilename)
        console.log('mainPhotoFilePath', mainPhotoFilePath)
        fs.unlink(mainPhotoFilePath, (error) => {
            if (error) {
                console.error('Ошибка при удалении файла mainPhoto:', error);
            }
        });

        // Удаление файлов из additionalPhotos
        const additionalPhotos = productCard.additionalPhotos;
        additionalPhotos.forEach((photo) => {
            const filePath = `./static/${photo}`;
            fs.unlink(filePath, (error) => {
                if (error) {
                    console.error('Ошибка при удалении файла additionalPhoto:', error);
                }
            });
        });

        const isCategoryRemovalSuccessful = await this.categoriesService.removeProductCardFromCategories(productId);

        const isShelterRemovalSuccessful = await this.shelterService.removeProductCardFromShelter(shelterId, productId);

        // Проверяем, было ли успешно удаление карточки товара из категорий и приюта
        const isDeletionSuccessful = isCategoryRemovalSuccessful && isShelterRemovalSuccessful;

        if (isDeletionSuccessful) {
            return productCard;
        } else {
            // Обработка случая, когда удаление не было успешным
            // Можно выбросить исключение или вернуть null/undefined в зависимости от требований
        }
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
            $and: [
              { $or: [
                { 'categories.category': regexQuery },
                { 'categories.subcategory': regexQuery },
                { 'categories.section': regexQuery },
                { 'information.name': regexQuery },
                { 'information.description': regexQuery },
              ] },
              { published: true },
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
      .find({ published: true })
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
        const query = this.productCardRepository.findOne({ _id: id, published: true })
          .select('information.name information.description pricesAndQuantity');
        return query.exec();
      }

      async getProductCardDetails(id: string) {
        const query = this.productCardRepository.findOne({ _id: id, published: true });
        return query.exec();
      }

      async addViewToProductCard(id: string) {
        const query = this.productCardRepository.findOneAndUpdate(
          { _id: id, published: true },
          { $inc: { viewsCount: 1 } },
          { new: true }
        );
        return query.exec();
      }

    async getAllProductCards(page: number, limit: number) {
        const skip = (page - 1) * limit;
        const totalCount = await this.productCardRepository.countDocuments();
        const totalPages = Math.ceil(totalCount / limit);

       const productCards = await this.productCardRepository.find({ published: true })
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
        .find({ published: true })
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

  async addCommentToProduct(productId: string, userId: string, content: string): Promise<Comment> {
    const product = await this.productCardRepository.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    const comment = new this.commentRepository({ productId, userId, content });
    await comment.save();


    product.comments.push(comment._id);
    await product.save();

    return comment;
  }

  async deleteComment(productId: string, commentId: string): Promise<void> {
    const product = await this.productCardRepository.findById(productId);
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }

    // Удаление комментария из списка комментариев товара
    const commentIndex = product.comments.findIndex((id) => id.toString() === commentId);
    if (commentIndex === -1) {
      throw new HttpException('Comment not found in product', HttpStatus.NOT_FOUND);
    }
    product.comments.splice(commentIndex, 1);

    await Promise.all([product.save(), comment.deleteOne()]);
  }

  async updateComment(
    productId: string,
    commentId: string,
    content: string
  ): Promise<Comment> {
    const product = await this.productCardRepository.findById(productId);
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }

    comment.content = content;
    await comment.save();

    return comment;
  }

  async getCommentsByProduct(productId: string): Promise<Comment[]> {
    const product = await this.productCardRepository
      .findById(productId)
      .populate('comments')
      .exec();
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    return product.comments;
  }

  async searchProductCardsByCategory(category: string, page: number, limit: number) {
    const regexCategory = new RegExp(category);
    const skip = (page - 1) * limit;
      console.log('regexCategory', regexCategory)
    const totalCount = await this.productCardRepository.countDocuments({
      $or: [
        { 'categories.category.id': regexCategory },
        { 'categories.subcategory.id': regexCategory },
        { 'categories.section.id': regexCategory },
      ],
    });

    const totalPages = Math.ceil(totalCount / limit);

    const productCards = await this.productCardRepository.find({
      $or: [
        { 'categories.category.id': regexCategory },
        { 'categories.subcategory.id': regexCategory },
        { 'categories.section.id': regexCategory },
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

  async getUnpublishedProductCards(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const totalCount = await this.productCardRepository.countDocuments({ published: false });
    const totalPages = Math.ceil(totalCount / limit);

    const unpublishedProductCards = await this.productCardRepository
      .find({ published: false })
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      productCards: unpublishedProductCards,
      totalPages,
      currentPage: page,
    };
  }

  async getTotalPurchases(): Promise<{ total: number; totalLastMonth: number; totalAmount: number; totalAmountLastMonth: number }> {
    const total = await this.productCardRepository.aggregate([
      {
        $group: {
          _id: null,
          totalPurchaseCount: { $sum: "$purchaseCount" },
          totalAmount: { $sum: "$pricesAndQuantity.price" }
        }
      }
    ]);

    const totalLastMonth = await this.productCardRepository.aggregate([
      {
        $match: {
          createdAt: { $gte: moment().subtract(1, 'months').toDate() }
        }
      },
      {
        $group: {
          _id: null,
          totalPurchaseCount: { $sum: "$purchaseCount" },
          totalAmount: { $sum: "$pricesAndQuantity.price" }
        }
      }
    ]);

    const totalAmount = await this.productCardRepository.aggregate([
      { $group: { _id: null, totalAmount: { $sum: '$pricesAndQuantity.price' } } },
    ]);
    const totalAmountLastMonth = await this.productCardRepository.aggregate([
      { $match: { createdAt: { $gte: moment().subtract(1, 'months').toDate() } } },
      { $group: { _id: null, totalAmount: { $sum: '$pricesAndQuantity.price' } } },
    ]);

    return {
      total: total[0].totalPurchaseCount,
      totalLastMonth: totalLastMonth[0].totalPurchaseCount,
      totalAmount: totalAmount[0] ? totalAmount[0].totalAmount : 0,
      totalAmountLastMonth: totalAmountLastMonth[0] ? totalAmountLastMonth[0].totalAmount : 0,
    };
  }

  async createQuestion(productId: string, customerId: number, questionText: string): Promise<Question> {
    const product = await this.getProductCardById(productId);
    return this.questionService.createQuestion(product, customerId, questionText);
  }

}
