import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
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

  // @UseGuards(JwtAuthGuard)
  // @Get(':idCard')
  // async updateProductCard(
  //   @Body() updateProductCardDto: UpdateProductCardDto
  // ) {
  //   return this.deliveryService.updateProductCard(updateProductCardDto, idCard);
  // }
}
