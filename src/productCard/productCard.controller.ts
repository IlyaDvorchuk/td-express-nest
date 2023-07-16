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
import {CreateProductCardDto, UpdateProductCardDto} from './dto/create-product-card.dto';
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { editFileName, imageFileFilter } from "../utils/file-upload.utils";
import { JwtAuthGuard } from "../middlewares/auth.middleware";
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('product-cards')
export class ProductCardController {
  constructor(private readonly productCardService: ProductCardService) { }

  @Get('/category/:category')
  async searchProductCardsByCategory(
    @Param('category') category: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('minPrice') minPrice: number, // Добавьте параметр для минимальной цены
    @Query('maxPrice') maxPrice: number, // Добавьте параметр для максимальной цены
    @Query('color') color: string, // Добавьте параметр для цвета
    @Query('size') size: string, // Добавьте параметр для размера
  ) {
    return this.productCardService.searchProductCardsByCategory(
      category,
      page,
      limit,
      minPrice,
      maxPrice,
      color,
      size,
    );
  }

  @Get('/search')
  async searchProductCards(
    @Query('query') query: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('minPrice') minPrice: number, // Добавьте параметр для минимальной цены
    @Query('maxPrice') maxPrice: number, // Добавьте параметр для максимальной цены
    @Query('color') color: string, // Добавьте параметр для цвета
    @Query('size') size: string, // Добавьте параметр для размера
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

  @Get('/hot-offers')
  async getHotOffers(
    @Query('page') page: number,
    @Query('limit') limit: number,
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
    const shelterId = req.user.id
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



}
