import { Controller, Post, Body, Param, Get, Patch, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from "./dto/create-order.dto";

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(
    @Body() order: CreateOrderDto,
  ) {
    console.log('order', order);
    return this.orderService.createOrder(order);
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
