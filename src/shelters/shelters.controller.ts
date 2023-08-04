import { Body, Controller, Get, Param, Query, Req, UseGuards } from "@nestjs/common";
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
    const shelterId = req.user.shelter.id
    return await this.shelterService.getDeliveryPoints(shelterId)
  }

  @UseGuards(JwtAuthGuard)
  @Get('cards')
  async getCardsShelter(
    @Req() req,
    @Query('page') page: number = 1, // Номер страницы по умолчанию: 1
    @Query('limit') limit: number = 10 // Количество элементов на странице по умолчанию: 10
  ) {
    const shelterId = req.user.shelter.id;
    return  await this.shelterService.getCards(shelterId, page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getShelter(@Req() req) {
    const shelterId = req.user.shelter.id
    console.log('req.user', req.user)
    return this.shelterService.findById(shelterId)
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
    const shelterId = req.user.shelter.id;
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
    const shelterId =  req.user.shelter.id;
    return await this.shelterService.getNotificationsByShelter(shelterId);
  }
}
