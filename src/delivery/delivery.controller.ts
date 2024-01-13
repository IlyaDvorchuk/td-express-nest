import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { DeliveryService } from "./delivery.service";
import { JwtAuthGuard } from "../middlewares/auth.middleware";
import { CreateDeliveryDto } from "./dto/delivery.dto";

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async updateDelivery(
    @Req() req,
    @Body() delivery: CreateDeliveryDto
  ) {
    console.log('CreateDeliveryDto', delivery);
    const shelterId = req.user
    return this.deliveryService.updateDelivery(shelterId, delivery);
  }

  @Get('cart/:shelterIds')
  async getDeliveryCart(
      @Param('shelterIds') shelterIds: string
  ) {
    console.log('shelterIds', shelterIds);
    const array = JSON.parse(shelterIds) as string[]
    console.log('array', array)
    return this.deliveryService.getDeliveryCitiesCart(array);
  }

  @Get(':shelterId')
  async getDelivery(
    @Param('shelterId') shelterId: string
  ) {
    console.log('shelterId', shelterId);
    return this.deliveryService.getDeliveryCities(shelterId);
  }


}
