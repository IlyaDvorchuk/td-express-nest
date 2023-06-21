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
import { CreateProductCardDto } from './dto/create-product-card.dto';
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { editFileName, imageFileFilter } from "../utils/file-upload.utils";
import { JwtAuthGuard } from "../middlewares/auth.middleware";
import { ApiResponse } from "@nestjs/swagger";
import { CreateCommentDto } from './dto/create-comment.dto';
import { Roles } from 'src/auth/roles-auth.decorator';

@Controller('product-cards')
export class ProductCardController {
  constructor(private readonly productCardService: ProductCardService) { }

  //поиск товаров по категории
  @Get('/category/:category')
  async searchProductCardsByCategory(
    @Param('category') category: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {

    return this.productCardService.searchProductCardsByCategory(category, page, limit);
  }

  //получение новых товаров
  @ApiResponse({ status: 200 })
  @Get('/new')
  async getNewProductCards(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return await this.productCardService.getNewProductCards(page, limit);
  }

  //получение горячих товаров (выборка по просмотрам товара)
  @Get('hot-offers')
  async getHotOffers(
    @Query('page') page: number,
    @Query('limit') limit: number
  ) {
    return await this.productCardService.getHotOffers(page, limit);
  }

  //получение товара по id
  @Get(':id')
  async getProductCardById(@Param('id') id: string) {
    return this.productCardService.getProductCardById(id);
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
        destination: (req, file, cb) => {
          let destination = './static/main-photos'; // Путь для сохранения основной фотографии
          if (file.fieldname === 'additionalPhotos') {
            destination = './static/additional-photos'; // Путь для сохранения дополнительных фотографий
          }
          cb(null, destination);
        },
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    })
  )

  // Создание карточки товара
  async createProductCard(
    @Req() req,
    @Body() createProductCardDto: CreateProductCardDto,
    @UploadedFiles() files: { mainPhoto: Express.Multer.File, additionalPhotos: Express.Multer.File[] },
  ) {
    console.log('createProductCard req');
    const { mainPhoto, additionalPhotos } = files
    const shelterId = req.user.id
    const mainPhotoPath = mainPhoto ? '/main-photos/' + mainPhoto[0].filename : undefined;
    const additionalPhotosPaths = additionalPhotos.map(file => '/additional-photos/' + file.filename);
    return await this.productCardService.createProductCard(
      createProductCardDto,
      shelterId,
      mainPhotoPath,
      additionalPhotosPaths
    );
  }

  //обновление карточки
  @Put(':id')
  async updateProductCard(@Param('id') id: string, @Body() updateProductCardDto: CreateProductCardDto) {
    return this.productCardService.updateProductCard(id, updateProductCardDto);
  }

  //удаление карточки
  @Delete(':id')
  async deleteProductCard(@Param('id') id: string) {
    return this.productCardService.deleteProductCard(id);
  }

  //поиск товара
  @Get()
  async searchProductCards(@Query('query') query: string, @Query('page') page: number, @Query('limit') limit: number) {
    return this.productCardService.searchProductCards(query, page, limit);
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



  //получение неопубликованных товаров
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @Get('/unpublished')
  async getUnpublishedProductCards(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.productCardService.getUnpublishedProductCards(page, limit);
  }
}
