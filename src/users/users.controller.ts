import {Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Req, UseGuards, UsePipes} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ValidationPipe } from "../pipes/validation.pipe";
import {JwtAuthGuard} from "../middlewares/auth.middleware";
import { CreateNotificationDto } from "src/notification/dto/notification.dto";
import { CreateCartDto } from "src/cart/dto/create-cart.dto";
import { CreateProductCardDto } from "src/productCard/dto/create-product-card.dto";

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {
  }

  //добавить в корзину
  @UseGuards(JwtAuthGuard)
  @Post('/addToCart')
  addItemToCart(@Req() req, @Body() dto: CreateCartDto) {
    const userId = req.user.id
    return this.usersService.addToCart(userId, dto)
  }

  @ApiOperation({summary: 'Создание пользователя'})
  @ApiResponse({status: 200, type: 'sddsf'})
  @UsePipes(ValidationPipe)
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto)
  }

  //удалить из корзины
  @UseGuards(JwtAuthGuard)
  @Post('/removeFromCart')
  removeFromCart(@Req() req, @Body() productCardId: string, product: CreateProductCardDto) {
    const userId = req.user.id
    console.log('removeFromCart', userId)
    return this.usersService.removeFromCart(userId, productCardId)
  }

  //показать избранное
  @UseGuards(JwtAuthGuard)
  @Get('/getFavorites')
  getFavorites(@Req() req) {
    const userId = req.user.id
    return this.usersService.getFavorites(userId)
  }

  //добавить в избранное
  @UseGuards(JwtAuthGuard)
  @Get('/addToFavorite/:goodId')
  addToFavorite(@Req() req, @Param('goodId') goodId: string) {
    const userId = req.user.id
    return this.usersService.addToFavorites(userId, goodId)
  }

  //удалить из избранного
  @UseGuards(JwtAuthGuard)
  @Get('/removeFromFavorite')
  removeFromFavorite(@Req() req, @Body() productCardId: string, product: CreateProductCardDto) {
    const userId = req.user.id
    console.log('removeFromFavorite', userId)
    return this.usersService.removeFromFavorite(userId, productCardId)
  }

  //создание уведомления для пользователя
  @Post('notifications')
  async createNotification(@Body() dto: CreateNotificationDto)/*: Promise<NotificationDocument>*/ {
    try {
      return await this.usersService.createNotification(dto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('notifications/:id/mark-as-read')
  async markNotificationAsRead(@Param('id') notificationId: string)/*: Promise<NotificationDocument>*/ {
    try {
      return await this.usersService.markNotificationAsRead(notificationId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':userId/notifications')
  async getUserNotifications(@Param('userId') userId: string) /*: Promise<NotificationDocument[]>*/ {
    try {
      //return await this.usersService.getUserNotifications(userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/user/:userId')
async getProductCards(
  @Param('userId') userId: string,
  @Body('page') page: number,
  @Body('limit') limit: number,
) {
  return this.usersService.getProductCards(userId, page, limit);
}

  @UseGuards(JwtAuthGuard)
  @Get('/get-user')
  async getUser(@Req() req) {
    const shelterId = req.user.id
    return this.usersService.findById(shelterId)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get-cart')
  async getCart(@Req() req) {
    const shelterId = req.user.id
    return this.usersService.findById(shelterId)
  }
}
