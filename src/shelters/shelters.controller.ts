import { Controller, Get, Req, UseGuards } from "@nestjs/common";
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
}
