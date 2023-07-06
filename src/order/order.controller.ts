import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post(':userId/:productId')
  async createOrder(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
    @Body('status') orderStatus: string,
  ) {
    return this.orderService.createOrder(userId, productId, orderStatus); 
  }
}