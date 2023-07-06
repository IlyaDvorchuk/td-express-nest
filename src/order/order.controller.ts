import { Controller, Post, Body, Param, Get, Patch, Delete } from '@nestjs/common';
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

  @Get(':userId')
  async getUserOrders(@Param('userId') userId: string) {
    return this.orderService.getUserOrders(userId);
  }

  @Patch(':orderId')
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body('status') newStatus: string,
  ) {
    return this.orderService.updateOrderStatus(orderId, newStatus);
  }

  @Delete(':orderId')
  async cancelOrder(@Param('orderId') orderId: string) {
    return this.orderService.cancelOrder(orderId);
  }
}
