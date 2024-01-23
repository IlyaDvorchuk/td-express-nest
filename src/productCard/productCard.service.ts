import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { isValidObjectId, Model } from "mongoose";
import {ColorImage, Comment, ProductCard, TypeQuantity} from "./productCard.schema";
import { CreateProductCardDto, UpdateProductCardDto } from "./dto/create-product-card.dto";
import { SheltersService } from "../shelters/shelters.service";
import { CategoriesService } from "../categories/categories.service";
import moment from "moment";
import { Question } from "src/questionary/questionary.schema";
import { QuestionaryService } from "../questionary/questionary.service";
import { isBase64String } from "../utils/isBase64String";
import * as fs from "fs";
import * as uuid from "uuid";
import * as path from "path";
import {AddColorDto} from "./dto/add-color.dto";
import * as sharp from "sharp";
import {Favorites, FavoritesDocument} from "../favorite/favorite-item.schema";

@Injectable()
export class ProductCardService {
  constructor(
    @InjectModel(ProductCard.name) private productCardRepository: Model<ProductCard>,
    @InjectModel(TypeQuantity.name) private typeRepository: Model<TypeQuantity>,
    @InjectModel(Comment.name) private commentRepository: Model<Comment>,
    @InjectModel(Favorites.name) private favoritesRepository: Model<FavoritesDocument>,
    private questionService: QuestionaryService,
    private shelterService: SheltersService,
    private categoriesService: CategoriesService,
  ) { }

  staticDir() {
    return path.join(__dirname, "..", "..", "static");
  }

  private getParentFolder(inputString: string): string {
    const parts = inputString.split('/');
    return `/${parts[1]}`;
  }

  async processColors(dto, productIdFolder) {
    const staticDir = this.staticDir();

    for (const color of dto.colors) {
      console.log('color?.image', color?.image)
      console.log('isBase64String(color?.image)', isBase64String(color?.image))
      if (color?.image && isBase64String(color?.image)) {
        const photo = color?.image;

        const base64Data = photo.replace(/^data:image\/[a-z]+;base64,/, '');
        const fileName = `${uuid.v4()}.jpg`;
        const folderPath = path.join(staticDir, productIdFolder, 'color-photos');
        const targetPath = path.join(folderPath, fileName);
        const buffer = Buffer.from(base64Data, 'base64');

        try {
          console.log('targetPath 50', targetPath);
          console.log('folderPath 50', folderPath);
          await fs.promises.mkdir(folderPath, { recursive: true }); // Создаем папку рекурсивно
          await fs.promises.writeFile(targetPath, buffer);
          console.log('Изображение успешно загрузилось');
          color.image = `${productIdFolder}/color-photos/${fileName}`
          // for (const type of dto.typeQuantity) {
          //   if (type?.color.name === color.name) {
          //     type.color.image = `/${productIdFolder}/color-photos/${fileName}`;
          //   }
          // }
        } catch (err) {
          console.error('Ошибка при записи файла:', err);
          throw new HttpException(
            'Не удалось сохранить изображения цветов',
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }
      }
    }
  }

  private async checkFavorites(goods, userId?: string) {
    if (!userId) return goods
    let favorites = []
    const favoriteItem = await this.favoritesRepository.findOne({userId});
    if (favoriteItem) {
      favorites = favoriteItem.items.map(item => item.productId.toString());
    }

    return goods.map((offer) => {
      const offerObject = offer.toObject();
      return {
        ...offerObject,
        isFavorite: favorites.includes(offer._id.toString()),
      };
    });

  }

  async getProductCardById(id: string, userId?: string): Promise<ProductCard> {
    const query = await this.productCardRepository.findOne({ _id: id, published: true });
    if (!query) {
      throw new HttpException(
          'Не удалось найти товар',
          HttpStatus.NOT_FOUND
      );
    }
    const cardWithFavorite = await this.checkFavorites([query], userId)
    return cardWithFavorite[0];
  }

  async getProductCardsById(productIds: string[]): Promise<ProductCard[]> {
    return this.productCardRepository.find({ _id: { $in: productIds } });
  }

  async getProductCardByUserId(id: string): Promise<ProductCard> {
    const query = this.productCardRepository.findOne({ _id: id, published: true });
    //поиск по избранному и корзине для объединения в общий список

    return query.exec();
  }

  async addColor(color: AddColorDto, productIdFolder: string, productId) {
    const staticDir = this.staticDir();

      // console.log('color', color)
      // console.log('isBase64String(color?.image)', isBase64String(color?.image))
      if (color?.image && isBase64String(color?.image)) {
        const photo = color?.image;

        const base64Data = photo.replace(/^data:image\/[a-z]+;base64,/, '');
        const fileName = `${uuid.v4()}.jpg`;
        const folderPath = path.join(staticDir, productIdFolder, 'color-photos');
        const targetPath = path.join(folderPath, fileName);
        const buffer = Buffer.from(base64Data, 'base64');

        try {
          await fs.promises.mkdir(folderPath, { recursive: true }); // Создаем папку рекурсивно
          await fs.promises.writeFile(targetPath, buffer);
          console.log('Изображение успешно загрузилось');
          color.image = `${productIdFolder}/color-photos/${fileName}`
          const product = await this.productCardRepository.findById(productId)
          if (!product) {
            throw new HttpException(
                'Не удалось найти товар',
                HttpStatus.NOT_FOUND
            );
          }
          product.colors.push(color as ColorImage)
          await product.save()
          // for (const type of dto.typeQuantity) {
          //   if (type?.color.name === color.name) {
          //     type.color.image = `/${productIdFolder}/color-photos/${fileName}`;
          //   }
          // }
        } catch (err) {
          console.error('Ошибка при записи файла:', err);
          throw new HttpException(
              'Не удалось сохранить изображения цветов',
              HttpStatus.INTERNAL_SERVER_ERROR
          );
        }
      }
    return true
  }

  async changeImageCompression (pathSharp: string, newFileName: string) {
    const newPath = path.join(path.dirname(pathSharp), newFileName)


    await sharp(pathSharp)
        .resize({ width: 1200, height: 1200, fit: 'inside' })
        .withMetadata()
        .toFile(newPath)

    sharp.cache(false);
    fs.unlink(pathSharp, (unlinkErr) => {
      if (unlinkErr) {
        console.error(`Ошибка при удалении файла: ${unlinkErr}`);
      } else {
        console.log(`Файл по пути ${pathSharp} успешно удален.`);
      }
    });
    return newPath.replace(/^static/, '');
  }

  async createProductCard(
    dto: CreateProductCardDto,
    shelterId: string,
    mainPhoto: string,
    additionalPhotos: string[],
    productIdFolder: string,
  ) {

      // Извлекаем расширение файла
      const pathSharp = path.join('./static', mainPhoto);

      const fileExtension = path.extname(pathSharp);

      // Формируем новое имя файла с добавлением строки "1"
      const newFileName = path.basename(pathSharp, fileExtension) + '1' + fileExtension;

      // Сжимаем оригинальный файл и сохраняем с новым именем в той же папке
      const updateMainPhoto = await this.changeImageCompression(pathSharp, newFileName)

      const updateAdditionalPhotos = await Promise.all(additionalPhotos.map(async (file, index) => {
        const outputPath = additionalPhotos[index];
        const pathSharp = path.join('./static', outputPath);
        const fileExtension = path.extname(pathSharp);

        const newFileName = path.basename(pathSharp, fileExtension) + '1' + fileExtension;
        return await this.changeImageCompression(pathSharp, newFileName)

      }));


    for (let field of Object.keys(dto)) {
      if (typeof dto[field] === 'string' && field !== 'nameShelter') {
        try {

          const parsedJson = JSON.parse(dto[field]);
          if (typeof parsedJson === 'object' && parsedJson !== null) {
            dto[field] = parsedJson;
          } else {
            // The parsed JSON is not an object, handle this case
            console.log('Parsed JSON is not an object:', parsedJson);
            // You can throw an error or handle it in some other way
          }
        } catch (error) {
          console.log('error', error);
          // Handle JSON parse error
          throw new HttpException(
            'Ошибка при разборе JSON',
            HttpStatus.BAD_REQUEST
          );
        }
      }
    }

    await this.processColors(dto, productIdFolder);

    // if ('colors' in dto) {
    //   delete dto.colors;
    // }

    const product = await this.productCardRepository.create({
      ...dto,
      shelterId,
      mainPhoto: updateMainPhoto,
      additionalPhotos: updateAdditionalPhotos,
      viewsCount: 0,
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

  async updateProductCard(dto: UpdateProductCardDto, id: string) {
    const product = await this.productCardRepository.findById(id);
    const parentFolder = this.getParentFolder(product.mainPhoto)
    const staticDir = this.staticDir();

    if (typeof dto.mainPhoto === 'string') {
      if (isBase64String(dto.mainPhoto)) {
        console.log('isBase64String(dto.mainPhoto) 153');
        const base64Data = dto.mainPhoto.replace(/^data:image\/[a-z]+;base64,/, '');
        // Используем значение из product.mainPhoto для пути к файлу
        const filePath = product.mainPhoto;


        const targetPath = path.join(staticDir, `${parentFolder}/main-photos`, path.basename(filePath));
        // Создаем буфер из строки base64
        const buffer = Buffer.from(base64Data, 'base64');
        // Записываем буфер в файл (асинхронно)


        fs.writeFile(targetPath, buffer, (err) => {
          if (err) {
            console.error('Ошибка при записи файла:', err);
          } else {
            console.log('Изображение успешно заменено');
          }
        });
      } else {
        console.log('Строка не является base64');
      }

      for (let i = 0; i < dto.additionalPhotos.length; i++) {
        const photo = dto.additionalPhotos[i];
        if (typeof photo === 'string') {
          if (isBase64String(photo)) {
            console.log('Элемент массива является base64:');
            // Преобразование base64 в файл и обновление элемента в product.additionalPhotos
            const base64Data = photo.replace(/^data:image\/[a-z]+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');

            // Проверка индекса и добавление нового элемента, если он не существует
            if (i >= product.additionalPhotos.length) {
              const newFilePath = `/${parentFolder}/additional-photos/${uuid.v4()}.jpg`;
              product.additionalPhotos.push(newFilePath);
              const targetPath = path.join(staticDir, `${parentFolder}/additional-photos`, path.basename(newFilePath))
              // console.log('staticDir', staticDir);
              // console.log('`${parentFolder}/main-photos`', `${parentFolder}/additional-photos`);
              // console.log('path.basename(filePath)', path.basename(newFilePath));
              // console.log('targetPath', targetPath);
              // Сохранение файла по новому пути (асинхронно)
              fs.writeFile(targetPath, buffer, (err) => {
                if (err) {
                  console.error('Ошибка при записи файла:', err);
                } else {
                  console.log('Изображение успешно добавлено');
                }
              });
            } else {
              // Используйте product.additionalPhotos[i] для пути к файлу
              const filePath = product.additionalPhotos[i];
              // Замена файла по указанному пути (асинхронно)
              const targetPath = path.join(staticDir, `${parentFolder}/additional-photos`, path.basename(filePath))
              fs.writeFile(targetPath, buffer, (err) => {
                if (err) {
                  console.error('Ошибка при записи файла:', err);
                } else {
                  console.log('Изображение успешно заменено');
                }
              });
            }
          } else {
            console.log('Элемент массива не является base64:', photo);
          }
        }
      }
    }
    for (let i = 0; i < dto.colors.length || 0; i++) {
        const colorItem = dto.colors[i];
        const existingImage = product.colors.find(colorProduct => colorProduct.name === colorItem.name)
        // Удаление фотографии цвета
        if (!colorItem?.image) {
          const filePath = existingImage?.image;
          if (!filePath) continue
          const targetPath = path.join(staticDir, `${parentFolder}/color-photos`, path.basename(filePath));

          fs.access(targetPath, fs.constants.F_OK, (err) => {
            if (!err) {
              // Файл существует, удаляем его асинхронно
              fs.unlink(targetPath, (unlinkErr) => {
                if (unlinkErr) {
                  console.error(`Ошибка при удалении файла: ${unlinkErr}`);
                } else {
                  console.log(`Файл по пути ${targetPath} успешно удален.`);
                }
              });
            } else {
              console.error(`Файл по пути ${targetPath} не существует или произошла ошибка: ${err}`);
            }
          });

          dto.colors.splice(i, 1)
        } else if (colorItem.image && isBase64String(colorItem.image) ) {
          await this.processColors(dto, parentFolder)
        } else if (colorItem.image && isBase64String(colorItem.image) ) {
            const base64Data = colorItem.image.replace(/^data:image\/[a-z]+;base64,/, '');
            const filePath = existingImage?.image;
            // Используем значение из product.mainPhoto для пути к файлу
            const targetPath = path.join(staticDir, `${parentFolder}/color-photos`, path.basename(filePath));
            // Создаем буфер из строки base64
            const buffer = Buffer.from(base64Data, 'base64');
            // Записываем буфер в файл (асинхронно)
          dto.colors[i].image = existingImage.image
            fs.writeFile(targetPath, buffer, (err) => {
              if (err) {
                console.error('Ошибка при записи файла:', err);
              } else {
                console.log('Изображение успешно заменено');
              }
            });

        }
    }
    //   const colorItem = dto.colors[i];
    //   console.log('isBase64String(colorItem.image', isBase64String(colorItem.image));
    //   if (!colorItem.image) {
    //     for (const type of dto.typeQuantity) {
    //       if (type?.color.name === colorItem.name) {
    //         const filePath = type.color.image;
    //         const targetPath = path.join(staticDir, `${parentFolder}/color-photos`, path.basename(filePath));
    //
    //         if (fs.existsSync(targetPath)) {
    //           // Удаляем файл асинхронно
    //           fs.unlink(targetPath, (err) => {
    //             if (err) {
    //               console.error(`Ошибка при удалении файла: ${err}`);
    //             } else {
    //               console.log(`Файл по пути ${targetPath} успешно удален.`);
    //             }
    //           });
    //
    //         } else {
    //           console.log(`Файл по пути ${targetPath} не существует.`);
    //         }
    //         delete type.color.image;
    //         console.log('type.color', type.color);
    //
    //       }
    //     }
    //   } else if (isBase64String(colorItem.image)) {
    //     for (const type of dto.typeQuantity) {
    //       const filePath = type.color.image;
    //       console.log('filePath 251', filePath);
    //       // console.log('type?.color.name', type?.color.name);
    //       // console.log('colorItem.name', type?.color.name);
    //       // console.log('filePath', filePath);
    //
    //       if (type?.color.name === colorItem.name && !isBase64String(filePath)) {
    //
    //         const base64Data = colorItem.image.replace(/^data:image\/[a-z]+;base64,/, '');
    //         // Используем значение из product.mainPhoto для пути к файлу
    //         const targetPath = path.join(staticDir, `${parentFolder}/color-photos`, path.basename(filePath));
    //         // Создаем буфер из строки base64
    //         const buffer = Buffer.from(base64Data, 'base64');
    //         // Записываем буфер в файл (асинхронно)
    //
    //
    //         fs.writeFile(targetPath, buffer, (err) => {
    //           if (err) {
    //             console.error('Ошибка при записи файла:', err);
    //           } else {
    //             console.log('Изображение успешно заменено');
    //           }
    //         });
    //       } else {
    //         console.log('this.processColors(dto, parentFolder) 241');
    //         await this.processColors(dto, parentFolder);
    //       }
    //     }
    //   }
    // }
    // console.log('dto.typeQuantity', dto.typeQuantity);
    const modifiedDto = {
      ...dto,
      mainPhoto: product.mainPhoto,
      additionalPhotos: product.additionalPhotos,
      published: false
    }

    const answer = await this.categoriesService.updateCategories(dto.categories, product.categories, product, id)
    if (!answer) {
      throw new HttpException(
        'Не удалось обновить категории',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return await this.productCardRepository.findOneAndUpdate(
      { _id: id },
      modifiedDto,
      { new: true }
    ).exec();
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

    const colorImages = productCard?.colors as ColorImage[]
    if (colorImages) {
      colorImages.forEach((color) => {
        if (color?.image) {
          const filePath = `./static/${color?.image}`;
          fs.unlink(filePath, (error) => {
            if (error) {
              console.error('Ошибка при удалении файла additionalPhoto:', error);
            }
          });
        }

      });
    }

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

  async getNewProductCards(page: number, limit: number, userId?: string) {
    const skip = (page - 1) * limit;

    const totalCount = await this.productCardRepository.countDocuments({
      published: true
    });

    const totalPages = Math.ceil(totalCount / limit);

    const productCards = await this.productCardRepository
      .find({
        published: true
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    const productCardsWithFavorites = await this.checkFavorites(productCards, userId);
    return {
      productCards: productCardsWithFavorites,
      totalPages,
      currentPage: page,
    };
  }

  async searchProductCardsByCategory(
    category?: string,
    page?: number,
    limit?: number,
    minPrice?: number,
    maxPrice?: number,
    colors?: string[],
    userId?: string,
  ) {
    let query = this.productCardRepository.find({
      published: true,
      'pricesAndQuantity.price': {
        $gte: minPrice || 0,
        $lte: maxPrice || Number.MAX_SAFE_INTEGER
      }
    });

    if (category && category.trim() !== '') {
      query = query.or([
        { 'categories.category.id': category },
        { 'categories.subcategory.id': category },
        { 'categories.section.id': category }
      ]);
    }

    query = query.elemMatch('typeQuantity', {
      quantity: { $gt: 0 },
    });

    if (colors && colors.length > 0) {
      query = query.elemMatch('typeQuantity', {
        $or: colors.map(color => ({ 'color.name': color }))
      });
    }

    const totalCount = await this.productCardRepository.count(query);

    const productCards = await this.productCardRepository
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

    const totalPages = Math.ceil(totalCount / limit);

    const minPriceRange = productCards.reduce((min, product) => {
      const price = product.pricesAndQuantity?.price || product.pricesAndQuantity?.priceBeforeDiscount;
      return price < min ? price : min;
    }, Infinity);

    const maxPriceRange = productCards.reduce((max, product) => {
      const price = product.pricesAndQuantity?.price || product.pricesAndQuantity.priceBeforeDiscount;
      return price > max ? price : max;
    }, 0);

    const productCardsWithFavorites = await this.checkFavorites(productCards, userId);
    return {
      productCards: productCardsWithFavorites,
      minPriceRange,
      maxPriceRange,
      totalPages,
      currentPage: page,
      totalCount
    }
  }

  private getRangePrices(productCards) {
    const minPriceRange = productCards.reduce((min, product) => {
      const price = product.pricesAndQuantity?.priceBeforeDiscount || product.pricesAndQuantity?.price;
      return price < min ? price : min;
    }, Infinity);

    const maxPriceRange = productCards.reduce((max, product) => {
      const price = product.pricesAndQuantity.priceBeforeDiscount || product.pricesAndQuantity?.price;
      return price > max ? price : max;
    }, 0);

    return {
      minPriceRange,
      maxPriceRange
    }
  }


  async searchProductCards(
    query: string,
    page?: number,
    limit?: number,
    minPrice?: number,
    maxPrice?: number,
    colors?: string[],
    userId?: string,
  ) {
    const regexQuery = new RegExp(query, 'i');

    let filter = this.productCardRepository.find({
      published: true,
      'pricesAndQuantity.price': {
        $gte: minPrice || 0,
        $lte: maxPrice || Number.MAX_SAFE_INTEGER
      }
    });

    if (query && query.trim() !== '') {
      filter = filter.or([
        { 'categories.category': regexQuery },
        { 'categories.subcategory': regexQuery },
        { 'categories.section': regexQuery },
        { 'information.name': regexQuery },
        { 'information.description': regexQuery },
      ]);
    }

    filter = filter.elemMatch('typeQuantity', {
      quantity: { $gt: 0 },
    });

    if (colors && colors.length > 0) {
      filter = filter.elemMatch('typeQuantity', {
        $or: colors.map(color => ({ 'color.name': color }))
      });
    }

    const totalCount = await this.productCardRepository.countDocuments(filter);

    const totalPages = Math.ceil(totalCount / limit);

    const productCards = await this.productCardRepository
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const {minPriceRange, maxPriceRange} = this.getRangePrices(productCards)
    const productCardsWithFavorites = await this.checkFavorites(productCards, userId);
    return {
      productCards: productCardsWithFavorites,
      totalPages,
      currentPage: page,
      minPriceRange,
      maxPriceRange
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
    // Проверка валидности id
    if (!isValidObjectId(id)) {
      return false;
    }

    const query = this.productCardRepository.findOneAndUpdate(
      { _id: id, published: true },
      { $inc: { viewsCount: 1 } },
      { new: true }
    );
    const result = await query.exec();

    return result !== null;


  }



  async getHotOffers(page: number, limit: number, userId?: string) {
    const skip = (page - 1) * limit;

    const totalCount = await this.productCardRepository.countDocuments({
      published: true
    });

    const totalPages = Math.ceil(totalCount / limit);

    const hotOffers = await this.productCardRepository
      .find({
        published: true
      })
      .sort({ viewsCount: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    const hotOffersWithFavorites = await this.checkFavorites(hotOffers, userId);

    return {
      productCards: hotOffersWithFavorites,
      totalPages,
      currentPage: page,
    };
  }

  async getAllProductCards(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const totalCount = await this.productCardRepository.countDocuments({
      published: true,
      'pricesAndQuantity.quantity': { $gt: 0 }, // Фильтр для количества больше 0
    });
    const totalPages = Math.ceil(totalCount / limit);

    const productCards = await this.productCardRepository
        .find({ published: true, 'pricesAndQuantity.quantity': { $gt: 0 } }) // Фильтр для количества больше 0
        .skip(skip)
        .limit(limit)
        .exec();

    const {minPriceRange, maxPriceRange} = this.getRangePrices(productCards)

    return {
      productCards,
      totalPages,
      minPriceRange,
      maxPriceRange,
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

  // async addCommentToProduct(productId: string, userId: string, content: string): Promise<Comment> {
  //   const product = await this.productCardRepository.findById(productId);
  //
  //   if (!product) {
  //     throw new Error('Product not found');
  //   }
  //
  //   const comment = new this.commentRepository({ productId, userId, content });
  //   await comment.save();
  //
  //
  //   product.comments.push(comment._id);
  //   await product.save();
  //
  //   return comment;
  // }

  // async deleteComment(productId: string, commentId: string): Promise<void> {
  //   const product = await this.productCardRepository.findById(productId);
  //   if (!product) {
  //     throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
  //   }
  //
  //   const comment = await this.commentRepository.findById(commentId);
  //   if (!comment) {
  //     throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
  //   }
  //
  //   // Удаление комментария из списка комментариев товара
  //   const commentIndex = product.comments.findIndex((id) => id.toString() === commentId);
  //   if (commentIndex === -1) {
  //     throw new HttpException('Comment not found in product', HttpStatus.NOT_FOUND);
  //   }
  //   product.comments.splice(commentIndex, 1);
  //
  //   await Promise.all([product.save(), comment.deleteOne()]);
  // }

  // async updateComment(
  //   productId: string,
  //   commentId: string,
  //   content: string
  // ): Promise<Comment> {
  //   const product = await this.productCardRepository.findById(productId);
  //   if (!product) {
  //     throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
  //   }
  //
  //   const comment = await this.commentRepository.findById(commentId);
  //   if (!comment) {
  //     throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
  //   }
  //
  //   comment.content = content;
  //   await comment.save();
  //
  //   return comment;
  // }
  //
  // async getCommentsByProduct(productId: string): Promise<Comment[]> {
  //   const product = await this.productCardRepository
  //     .findById(productId)
  //     .populate('comments')
  //     .exec();
  //   if (!product) {
  //     throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
  //   }

  //   return product.comments;
  // }



  async getUnpublishedProductCards(page: number, limit: number) {
    // const skip = (page - 1) * limit;

    // const totalCount = await this.productCardRepository.countDocuments({
    //   published: false,
      // 'shelter.isVerified': true,
      // 'pricesAndQuantity.quantity': { $gt: 0 }, // Фильтр для количества больше 0
    // })
      // .populate('shelter', 'isVerified');
    // const totalPages = Math.ceil(totalCount / limit);

    const unpublishedProductCards = await this.productCardRepository
      .find({ published: false, }) // Фильтр для количества больше 0
      // .populate('shelter', 'isVerified')
      // .skip(skip)
      // .limit(limit)
      .exec();

    return [
      ...unpublishedProductCards
      // productCards: unpublishedProductCards,
      // totalPages,
      // currentPage: page,
    ];
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

  async answerQuestion(questionId: string, answerText: string) {
    return this.questionService.answerQuestion(questionId, answerText);
  }

  async getAllQuestions() {
    return this.questionService.getAllQuestions();
  }

  async getQuestionById(questionId: string) {
    return this.questionService.getQuestionById(questionId);
  }

  async getAllAnsweredQuestions() {
    return this.questionService.getAllAnsweredQuestions();
  }

  async getAnswerForQuestion(questionId: string) {
    return this.questionService.getAnswerForQuestion(questionId);
  }

  async agreementGood(id: string) {
    try {
      const good = await this.productCardRepository.findById(id)

      good.published = true
      good.isReject = false
      await good.save()

      return true
    } catch (e) {
      console.log('e', e);
      return false
    }
  }

  async rejectGood(id: string) {
    try {
      const good = await this.productCardRepository.findById(id)
      good.isReject = true
      await good.save()
      return true
    } catch (e) {
      return false
    }
  }

  async getTypeById(productId: string, typeId: string) {
    const product = await this.productCardRepository
      .findById(productId)
      .exec();

    if (product && product.typeQuantity && product.typeQuantity.length > 0) {
      const matchingType = product.typeQuantity.find(type => type._id.toString() === typeId);


      return matchingType || null;
    } else {
      return null;
    }
  }
}
