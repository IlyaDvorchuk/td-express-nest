import {Controller, Get, Query, Req, UseGuards} from "@nestjs/common";
import { SheltersService } from "./shelters.service";
import { JwtAuthGuard } from "../middlewares/auth.middleware";

@Controller('shelters')
export class SheltersController {

  constructor(private shelterService: SheltersService) {
  }

  @UseGuards(JwtAuthGuard)
  @Get('delivery-points')
  async getDeliveryPoints(@Req() req) {
    const shelterId = req.user.id
    return await this.shelterService.getDeliveryPoints(shelterId)
  }

  @UseGuards(JwtAuthGuard)
  @Get('cards')
  async getCardsShelter(
    @Req() req,
    @Query('page') page: number = 1, // Номер страницы по умолчанию: 1
    @Query('limit') limit: number = 10 // Количество элементов на странице по умолчанию: 10
  ) {
    const shelterId = req.user.id;
    const cards = await this.shelterService.getCards(shelterId, page, limit);
    return cards;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getShelter(@Req() req) {
    const shelterId = req.user.id
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

  @UseGuards(JwtAuthGuard)
  @Get('orders')
  async getOrdersByShelter(@Req() req) {
    const shelterId = req.user.id;
    return await this.shelterService.getOrdersByShelter(shelterId);
  }
}