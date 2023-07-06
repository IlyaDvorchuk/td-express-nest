import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';
import { User, UserDocument } from 'src/users/users.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createOrder(userId: string, productId: string, orderStatus: string): Promise<Order> {
    const order = new this.orderModel({
      product: productId,
      status: orderStatus,
      user: userId,
    });
    await order.save();

    const user = await this.userModel.findById(userId).exec();
    user.orders.push(order);
    await user.save();

    return order;
  }

  async getOrderById(orderId: string): Promise<Order> {
    return this.orderModel.findById(orderId).exec();
  }

}
