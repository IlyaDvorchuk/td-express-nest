import {Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Req, UseGuards, UsePipes} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {Roles} from "../auth/roles-auth.decorator";
import {AddRoleDto} from "./dto/add-role.dto";
import {BanUserDto} from "./dto/ban-user.dto";
import { ValidationPipe } from "../pipes/validation.pipe";
import {JwtAuthGuard} from "../middlewares/auth.middleware";
import { CreateNotificationDto } from "src/notification/dto/notification.dto";
import { NotificationDocument } from "src/notification/notification.schema";
import { CreateCartDto } from "src/cart/dto/create-cart.dto";
import { CreateProductCardDto } from "src/productCard/dto/create-product-card.dto";
// import { NotificationDocument } from "src/notification/notification.schema";

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {
  }

  @ApiOperation({summary: 'Создание пользователя'})
  @ApiResponse({status: 200, type: 'sddsf'})
  @UsePipes(ValidationPipe)
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto)
  }

  @ApiOperation({summary: 'Получение всех пользователей'})
  @ApiResponse({status: 200})
  @Roles('ADMIN')
  @Get()
  getAll() {
    return this.usersService.getAllUsers()
  }

  @ApiOperation({summary: 'Выдать роль'})
  @ApiResponse({status: 200})
  @Roles('ADMIN')
  @Post('/role')
  addRole(@Body() dto: AddRoleDto) {
    return this.usersService.addRole(dto)
  }

  @ApiOperation({summary: 'Забанить пользователя'})
  @ApiResponse({status: 200})
  @Roles('ADMIN')
  @Post('/ban')
  ban(@Body() dto: BanUserDto) {
    return this.usersService.banUserById(dto)
  }

  @ApiOperation({summary: 'Разбанить пользователя'})
  @ApiResponse({status: 200})
  @Roles('ADMIN')
  @Post('/unbanUser')
  unbanUser(@Body() dto: BanUserDto) {
    return this.usersService.unbanUser(dto.userId)
  }

  //добавть в корзину
  @UseGuards(JwtAuthGuard)
  @Get('/addToCart')
  addItemToCart(@Req() req, @Body() dto: CreateCartDto, product: CreateProductCardDto) {
    const userId = req.user.id
    console.log('addItemToCart', userId)
    return this.usersService.addToCart(userId, dto, product)
  }

  //удалить из корзины
  @UseGuards(JwtAuthGuard)
  @Get('/removeFromCart')
  removeFromCart(@Req() req, @Body() productCardId: string, product: CreateProductCardDto) {
    const userId = req.user.id
    console.log('removeFromCart', userId)
    return this.usersService.removeFromCart(userId, productCardId, product)
  }

  //добавить в избранное
  @UseGuards(JwtAuthGuard)
  @Get('/addToFavorite')
  addToFavorite(@Req() req, @Body() dto: CreateCartDto, product: CreateProductCardDto) {
    const userId = req.user.id
    console.log('addToFavorite', userId)
    return this.usersService.addToFavorites(userId, dto, product)
  }

  //удалить из избранного
  @UseGuards(JwtAuthGuard)
  @Get('/removeFromFavorite')
  removeFromFavorite(@Req() req, @Body() productCardId: string, product: CreateProductCardDto) {
    const userId = req.user.id
    console.log('removeFromFavorite', userId)
    return this.usersService.removeFromFavorite(userId, productCardId, product)
  }

  //создание уведоиления для пользователя
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
}
