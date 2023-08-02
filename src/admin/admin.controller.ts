import { Body, Controller, Get, Param, Post, Query} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Roles } from "../auth/roles-auth.decorator";
import { UsersService } from "src/users/users.service";
import { AddRoleDto } from "src/users/dto/add-role.dto";
import { BanUserDto } from "src/users/dto/ban-user.dto";
import { ProductCardService } from "src/productCard/productCard.service";
import {SheltersService} from "../shelters/shelters.service";
import {NotificationService} from "../notification/notification.service";

@ApiTags('Админ')
@Controller('admin')
export class AdminController {
  constructor(private usersService: UsersService,
    private productCardService: ProductCardService,
              private sheltersService: SheltersService,
              private notificationsService: NotificationService
              ) {
  }

  @ApiOperation({ summary: 'Получение всех пользователей' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @Get()
  getAll() {
    return this.usersService.getAllUsers()
  }

  @ApiOperation({ summary: 'Выдать роль' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @Post('/role')
  addRole(@Body() dto: AddRoleDto) {
    return this.usersService.addRole(dto)
  }

  @ApiOperation({ summary: 'Забанить пользователя' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @Post('/ban')
  ban(@Body() dto: BanUserDto) {
    return this.usersService.banUserById(dto)
  }

  @ApiOperation({ summary: 'Разбанить пользователя' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @Post('/unbanUser')
  unbanUser(@Body() dto: BanUserDto) {
    return this.usersService.unbanUser(dto.userId)
  }

  //получение неопубликованных товаров // перенести в админку обновление статусов товара
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @Get('/unpublished')
  async getUnpublishedProductCards(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.productCardService.getUnpublishedProductCards(page, limit);
  }

  //получение всех покупок за все время и за последний месяц
  @Get('/total-purchases')
  @Roles('ADMIN')
  async getTotalPurchases() {
    return this.productCardService.getTotalPurchases();
  }

  //получение всех непровереныых продавцов
  @Get('/unverified-shelter')
  @Roles('ADMIN')
  async getUnverifiedShelters() {
    return this.sheltersService.getUnverifiedShelters()
  }

  @ApiOperation({ summary: 'Подтвердить продавца' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @Get('/agreement-shelter/:id')
  agreementShelter(@Param('id') id: string) {
    return this.sheltersService.agreementShelter(id)
  }


  @ApiOperation({ summary: 'Подтвердить продавца' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @Get('/create-notification/:id/')
    createNotification(@Param('id') id: string, @Query('text') text: string) {
    return this.notificationsService.createNotification(id, text);
  }
}
