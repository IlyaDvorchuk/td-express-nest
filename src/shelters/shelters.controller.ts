import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { SheltersService } from "./shelters.service";
import { JwtAuthGuard } from "./auth.middleware";

@Controller('shelters')
export class SheltersController {

  constructor(private shelterService: SheltersService) {
  }

  @UseGuards(JwtAuthGuard)
  @Get('delivery-points')
  async getDeliveryPoints(@Req() req) {
    const shelterId = req.user.id
    console.log('req.user', req.user);
    console.log('shelterId', shelterId);
    return await this.shelterService.getDeliveryPoints(shelterId)
  }
}
