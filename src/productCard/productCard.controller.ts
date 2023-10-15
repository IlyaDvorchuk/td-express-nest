import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UploadedFiles,
  UseInterceptors,
  UseGuards, Req
} from '@nestjs/common';
import { ProductCardService } from './productCard.service';
import { CreateProductCardDto, UpdateProductCardDto } from './dto/create-product-card.dto';
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { editFileName, imageFileFilter } from "../utils/file-upload.utils";
import { JwtAuthGuard } from "../middlewares/auth.middleware";
import { CreateCommentDto } from './dto/create-comment.dto';
import { Question } from 'src/questionary/questionary.schema';
import { ApiResponse } from "@nestjs/swagger";
import * as uuid from 'uuid'
import { promises as fsPromises } from 'fs';

@Controller('product-cards')
export class ProductCardController {
  constructor(private readonly productCardService: ProductCardService) { }

  // Поиск по категории
  @Get('/category/:category')
  async searchProductCardsByCategory(
    @Param('category') category: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('minPrice') minPrice: number,
    @Query('maxPrice') maxPrice: number,
    @Query('colors') colors: string[] = [],
    @Query('size') size: string = '',
  ) {
    return this.productCardService.searchProductCardsByCategory(
      category,
      page,
      limit,
      minPrice,
      maxPrice,
        colors,
      size,
    );
  }

  // Поиск
  @Get('/search')
  async searchProductCards(
    @Query('query') query: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('minPrice') minPrice: number = 0,
    @Query('maxPrice') maxPrice: number = Number.MAX_SAFE_INTEGER,
    @Query('color') color: string = '',
    @Query('size') size: string = '',
  ) {
    return this.productCardService.searchProductCards(
      query,
      page,
      limit,
      minPrice,
      maxPrice,
      color,
      size,
    );
  }

  // Получение горячих товаров
  @Get('/hot-offers')
  async getHotOffers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return await this.productCardService.getHotOffers(page, limit);
  }

  // Получение новых товаров
  @ApiResponse({ status: 200 })
  @Get('/new')
  async getNewProductCards(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return await this.productCardService.getNewProductCards(page, limit);
  }



  //получение товара по id
  @Get('view-count/:id')
  async addViewCountIncrement(@Param('id') id: string) {
    return this.productCardService.addViewToProductCard(id);
  }

  //получение товара по id
  @Get(':id')
  async getProductCardById(@Param('id') id: string) {
    return this.productCardService.getProductCardById(id);
  }

  async generateProductId() {
    return uuid.v4();
  }

  //создание карточки товара
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'mainPhoto', maxCount: 1 },
      { name: 'additionalPhotos', maxCount: 10 }, // Максимальное количество дополнительных фотографий
    ], {
      storage: diskStorage({
        destination: async (req, file, cb) => {
          // @ts-ignore
          const productId = req.productId;
          const mainPhotoDestination = `./static/${productId}/main-photos`;
          const additionalPhotosDestination = `./static/${productId}/additional-photos`;

          // Создаем папки продукта асинхронно, если они не существуют
          await fsPromises.mkdir(mainPhotoDestination, { recursive: true });
          await fsPromises.mkdir(additionalPhotosDestination, { recursive: true });

          if (file.fieldname === 'mainPhoto') {
            cb(null, mainPhotoDestination);
          } else if (file.fieldname === 'additionalPhotos') {
            cb(null, additionalPhotosDestination);
          } else {
            cb(new Error('Invalid fieldname'), null);
          }
        },
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    })
  )

  async createProductCard(
    @Req() req,
    @Body() createProductCardDto: CreateProductCardDto,
    @UploadedFiles() files: { mainPhoto: Express.Multer.File, additionalPhotos: Express.Multer.File[] },
  ) {
    const { mainPhoto, additionalPhotos } = files
    const shelterId = req.user
    const productIdFolder = req.productId;
    const mainPhotoPath = mainPhoto ? `/${productIdFolder}/main-photos/${mainPhoto[0].filename}` : undefined;
    const additionalPhotosPaths = additionalPhotos.map(file => `/${productIdFolder}/additional-photos/${file.filename}`);

    return await this.productCardService.createProductCard(
      createProductCardDto,
      shelterId,
      mainPhotoPath,
      additionalPhotosPaths,
      productIdFolder
    );
  }

  //обновление карточки
  @UseGuards(JwtAuthGuard)
  @Put(':idCard')
  async updateProductCard(
    @Param('idCard',) idCard: string,
    @Body() updateProductCardDto: UpdateProductCardDto
  ) {
    return this.productCardService.updateProductCard(updateProductCardDto, idCard);
  }

  //удаление карточки
  @UseGuards(JwtAuthGuard)
  @Delete(':idCard')
  async deleteProductCard(
    @Req() req,
    @Param('idCard',) idCard: string) {
    const shelterId = req.user
    return this.productCardService.deleteProductCard(idCard, shelterId);
  }


  //добавление коммента к товару
  @Post(':id/comments')
  async createComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.productCardService.addCommentToProduct(id, createCommentDto.userId, createCommentDto.content);
  }

  //обновление/изменение коммента
  @Put(':id/comments/:commentId')
  async updateComment(
    @Param('id') id: string,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: CreateCommentDto,
  ) {
    return this.productCardService.updateComment(id, commentId, updateCommentDto.content);
  }

  //удаление коммента
  @Delete(':id/comments/:commentId')
  async deleteComment(
    @Param('id') id: string,
    @Param('commentId') commentId: string,
  ) {
    return this.productCardService.deleteComment(id, commentId);
  }


  //создание вопроса
  @Post('createQuestion/:productId/:customerId')
  async createQuestion(
    @Param('productId') productId: string,
    @Param('customerId') customerId: number,
    @Body('questionText') questionText: string,
  ): Promise<Question> {
    return this.productCardService.createQuestion(productId, customerId, questionText);
  }

  //ответ на вопрос
  @Post('answerQuestion/:questionId')
  async answerQuestion(
    @Param('questionId') questionId: string,
    @Body('answerText') answerText: string,
  ): Promise<Question> {
    return this.productCardService.answerQuestion(questionId, answerText);
  }

  //получение товара по id
  @Get('type/:productId/:typeId')
  async getTypeById(
    @Param('productId') productId: string,
    @Param('typeId') typeId: string
  ) {
    return this.productCardService.getTypeById(productId, typeId);
  }
  // @Get('all')
  // async getAllQuestions(): Promise<Question[]> {
  //   return this.productCardService.getAllQuestions();
  // }

  // @Get('getAllAnswered')
  // async getAllAnsweredQuestions(): Promise<Question[]> {
  //   return this.productCardService.getAllAnsweredQuestions();
  // }

}
