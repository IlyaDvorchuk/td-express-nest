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

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {
  }

  //добавить в корзину
  @UseGuards(JwtAuthGuard)
  @Post('/addToCart')
  addItemToCart(@Req() req, @Body() dto: CreateCartDto) {
    const userId = req.user
    return this.usersService.addToCart(userId, dto)
  }

  //удалить из корзины
  @UseGuards(JwtAuthGuard)
  @Post('/deleteCart')
  deleteItemToCart(@Req() req, @Body() dto: {idsCart: string[]}) {
    const userId = req.user
    console.log('dto: {idsCart: string[]}', dto);
    return this.usersService.removeFromCart(userId, dto.idsCart);
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
  removeFromCart(@Req() req, @Body() productCardIds: string[]) {
    const userId = req.user
    return this.usersService.removeFromCart(userId, productCardIds)
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
  @Get('/addToFavorite/:goodId')
  addToFavorite(@Req() req, @Param('goodId') goodId: string) {
    const userId = req.user
    return this.usersService.addToFavorites(userId, goodId)
  }

  //удалить из избранного
  @UseGuards(JwtAuthGuard)
  @Delete('/removeFromFavorite/:goodId')
  removeFromFavorite(@Req() req, @Param('goodId') goodId: string) {
    const userId = req.user
    return this.usersService.removeFromFavorite(userId, goodId)
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
