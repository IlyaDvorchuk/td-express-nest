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
    const order = await this.orderModel.create({
      product: productId,
      status: orderStatus,
      user: userId,
    });

    const user = await this.userModel.findById(userId).exec();
    // @ts-ignore
    user.orders.push(order._id);
    await user.save();

    return order;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    const user = await this.userModel.findById(userId).populate({
      path: 'orders',
      match: { status: { $ne: 'cancelled' } },
    }).exec();
    return user.orders;
  }

  async updateOrderStatus(orderId: string, newStatus: string): Promise<Order> {
    const order = await this.orderModel.findById(orderId).exec();
    order.status = newStatus;
    await order.save();
    return order;
  }

  async cancelOrder(orderId: string): Promise<Order> {
    const order = await this.orderModel.findById(orderId).exec();
    order.status = 'cancelled';
    await order.save();
    return order;
  }
}
