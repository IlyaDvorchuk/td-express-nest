import {Body, Controller, Delete, Get, Param, Query, Req, UseGuards} from "@nestjs/common";
import { SheltersService } from "./shelters.service";
import { JwtAuthGuard } from "../middlewares/auth.middleware";
import { Put } from "@nestjs/common";
import {ShelterDataDto, UpdateShelterShopDto} from "./dto/create-shelter.dto";

@Controller('shelters')
export class SheltersController {

  constructor(private shelterService: SheltersService) {
  }

  @UseGuards(JwtAuthGuard)
  @Get('delivery-points')
  async getDeliveryPoints(@Req() req) {
    const shelterId = req.user
    return await this.shelterService.getDeliveryPoints(shelterId)
  }

  @UseGuards(JwtAuthGuard)
  @Get('cards/:page/:limit')
  async getCardsShelter(
    @Req() req,
    @Param('page') page: number = 1, // Номер страницы по умолчанию: 1
    @Param('limit') limit: number = 10 // Количество элементов на странице по умолчанию: 10
  ) {
    const shelterId = req.user;
    return  await this.shelterService.getCards(shelterId, page, limit);
  }

  @Get('seller-cards/:name')
  async getCardsShelterByName(
      @Param('name') name: string, // Номер страницы по умолчанию: 1
      @Query('page') page: number = 1, // Номер страницы по умолчанию: 1
      @Query('limit') limit: number = 32, // Количество элементов на странице по умолчанию: 10
      @Query('minPrice') minPrice: number,
      @Query('maxPrice') maxPrice: number,
      @Query('colors') colors: string[] = [],
  ) {
    return  await this.shelterService.getCardsByName(name, page, limit, minPrice, maxPrice, colors);
  }


  @Get('/good/:id')
  async getShelterForGood(@Param('id') id: string) {
    return this.shelterService.findByIdForGood(id)
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getAllShelters(
    @Query('status') status: string,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string
  ) {
    const parsedFromDate = fromDate ? new Date(fromDate) : null;
    const parsedToDate = toDate ? new Date(toDate) : null;
    return await this.shelterService.getAllShelters(status, parsedFromDate, parsedToDate);
  }

  @UseGuards(JwtAuthGuard) // отображение товаров(заказов) продавца с его статусами для самого продавца
  @Get('orders')
  async getOrdersByShelter(@Req() req) {
    const shelterId = req.user
    return await this.shelterService.getOrdersByShelter(shelterId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('orders/:orderId')
  async updateOrderStatus(
    @Query('orderId') orderId: string,
    @Query('status') newStatus: string
  ) {
    return await this.shelterService.updateOrderStatus(orderId, newStatus);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-data/:shelterId')
  async updateShelterData(
    @Param('shelterId',) shelterId: string,
    @Body() shelterDataDto: ShelterDataDto
  ) {
    return await this.shelterService.updateShelterData(shelterId, shelterDataDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-shop/:shelterId')
  async updateShopData(
      @Param('shelterId',) shelterId: string,
      @Body() shelterDataDto: UpdateShelterShopDto
  ) {
    return await this.shelterService.updateShopData(shelterId, shelterDataDto);
  }

  // Уведомления продавца
  @UseGuards(JwtAuthGuard)
  @Get('notifications')
  async getNotificationsByShelter(@Req() req) {
    const shelterId =  req.user
    return await this.shelterService.getNotificationsByShelter(shelterId);
  }

  // Уведомления продавца
  @UseGuards(JwtAuthGuard)
  @Delete('notifications')
  async deleteNotificationsByShelter(
      @Req() req,
      @Body() deleteDto: string[]) {
    const shelterId =  req.user
    return await this.shelterService.deleteNotificationsByShelter(shelterId, deleteDto);
  }

  // Продавец прочитал уведомления
  @UseGuards(JwtAuthGuard)
  @Get('read-notifications')
  async readNotificationsByShelter(@Req() req) {
    const shelterId =  req.user
    return await this.shelterService.readNotificationsByShelter(shelterId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-rate/:sellerId/:rate')
  async updateRate(
      @Param('sellerId',) sellerId: string,
      @Param('rate',) rate: 'td-delivery' | 'self-delivery',
  ) {
    return await this.shelterService.updateRate(sellerId, rate);
  }


  @Get('user/:name')
  async getSellerForUser(@Param('name',) name: string,) {
    console.log('name', name)
    return await this.shelterService.getSellerForUser(name);
  }

  @Get('admin/:id')
  async getSellerForAdmin(@Param('id',) id: string,) {
    return await this.shelterService.getSellerForAdmin(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('view-goods/:id')
  async getSellerViewGood(@Param('id',) id: string,) {
    return await this.shelterService.getSellerCountGoods(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getShelter(@Req() req) {
    const shelterId = req.user
    return this.shelterService.findById(shelterId)
  }
}
