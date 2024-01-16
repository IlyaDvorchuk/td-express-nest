import {
  Body,
  Controller, Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ValidationPipe } from "../pipes/validation.pipe";
import {JwtAuthGuard} from "../middlewares/auth.middleware";
import { CreateCartDto } from "src/cart/dto/create-cart.dto";
import {DeleteCartDto} from "./dto/delete-cart.dto";

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {
  }

  //добавить в корзину
  @UseGuards(JwtAuthGuard)
  @Post('/addToCart/:sellerId')
  addItemToCart(@Req() req,  @Param('sellerId') sellerId: string, @Body() dto: CreateCartDto) {
    const userId = req.user
    return this.usersService.addToCart(userId, dto, sellerId)
  }

  //удалить из корзины
  @UseGuards(JwtAuthGuard)
  @Post('/deleteCart')
  deleteItemToCart(@Req() req, @Body() deleteCartDto: DeleteCartDto) {
    const userId = req.user
    console.log('deleteCartDto', deleteCartDto)
    return this.usersService.removeFromCart(userId, deleteCartDto.productCardIds, deleteCartDto.sellerIds)
  }

  @ApiOperation({summary: 'Создание пользователя'})
  @ApiResponse({status: 200, type: 'sddsf'})
  @UsePipes(ValidationPipe)
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto)
  }

  //показать избранное
  @UseGuards(JwtAuthGuard)
  @Get('/getFavorites')
  getFavorites(@Req() req) {
    const userId = req.user
    return this.usersService.getFavorites(userId)
  }

  //добавить в избранное
  @UseGuards(JwtAuthGuard)
  @Get('/addToFavorite/:goodId/:sellerId')
  addToFavorite(@Req() req, @Param('goodId') goodId: string, @Param('sellerId') sellerId: string) {
    const userId = req.user
    return this.usersService.addToFavorites(userId, goodId, sellerId)
  }

  //удалить из избранного
  @UseGuards(JwtAuthGuard)
  @Delete('/removeFromFavorite/:goodId/:sellerId')
  removeFromFavorite(@Req() req, @Param('goodId') goodId: string, @Param('sellerId') sellerId: string) {
    const userId = req.user
    return this.usersService.removeFromFavorite(userId, goodId, sellerId)
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
    const shelterId = req.user
    return this.usersService.findById(shelterId)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get-cart')
  async getCart(@Req() req) {
    const shelterId = req.user
    return this.usersService.getCartProducts(shelterId)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/set-count-cart/:typeId/:count')
  async setCountCart(@Req() req, @Param('typeId') typeId: string, @Param('count') count: number) {
    const userId = req.user
    return this.usersService.setCountCart(userId, typeId, count)
  }

  // Уведомления юзера
  @UseGuards(JwtAuthGuard)
  @Get('notifications')
  async getNotificationsByUser(@Req() req) {
    const userId =  req.user
    return await this.usersService.getNotificationsByUser(userId);
  }

  // Юзер прочитал уведомления
  @UseGuards(JwtAuthGuard)
  @Get('read-notifications')
  async readNotificationsByShelter(@Req() req) {
    const userId =  req.user
    return await this.usersService.readNotificationsByUser(userId);
  }
}
