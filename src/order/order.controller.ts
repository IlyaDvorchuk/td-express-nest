import { Controller, Post, Body, Param, Get, Patch, Delete, UseGuards, Req } from "@nestjs/common";
import { OrderService } from './order.service';
import { CreateOrderDto } from "./dto/create-order.dto";
import { JwtAuthGuard } from "../middlewares/auth.middleware";

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

  @Get('/user/:userId')
  async getUserOrders(@Param('userId') userId: string) {
    return this.orderService.getUserOrders(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/seller')
  async getSellerOrders( @Req() req,) {
    const sellerId = req.user
    return this.orderService.getSellerOrders(sellerId);
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
