import { Controller, Post, Body, Param, Get, Delete, UseGuards, Req, Put, Query } from "@nestjs/common";
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
    return this.orderService.createOrder(order);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/seller')
  async getSellerOrders(@Req() req, @Query('count') count?: number) {
    const sellerId = req.user;
    return this.orderService.getSellerOrders(sellerId, count);
  }

  @Get('/user/:userId')
  async getUserOrders(@Param('userId') userId: string) {
    return this.orderService.getUserOrders(userId);
  }

  @Get('/market')
  async getOrderMarketDelivery() {
    return this.orderService.getOrdersMarketDelivery();
  }

  @Get('/self-delivery')
  async getOrderSelfDelivery() {
    return this.orderService.getOrdersSelfDelivery();
  }

  @Get(':orderId')
  async getOrder(@Param('orderId') orderId: string) {
    return this.orderService.getOrder(orderId);
  }



  @Put('/:orderId/:status')
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Param('status') newStatus: string,
  ) {
    return this.orderService.updateOrderStatus(orderId, newStatus);
  }

  @Delete(':orderId')
  async cancelOrder(@Param('orderId') orderId: string) {
    return this.orderService.cancelOrder(orderId);
  }
}
