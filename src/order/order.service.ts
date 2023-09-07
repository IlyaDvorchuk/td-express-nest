import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';
import { User, UserDocument } from 'src/users/users.schema';
import { CreateOrderDto } from "./dto/create-order.dto";
import { Shelter, ShelterDocument } from "../shelters/shelters.schema";

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Shelter.name) private readonly shelterModel: Model<ShelterDocument>,
  ) {}

  async createOrder(orderDto: CreateOrderDto): Promise<Order> {
    const order = await this.orderModel.create(orderDto);

    const user = await this.userModel.findById(orderDto.userId).exec();

    if (user) {
      // @ts-ignore
      user.orders.push(order._id);
      await user.save();

    }

    const shelter = await this.shelterModel.findById(orderDto.shelterId).exec();

    if (shelter) {
      // @ts-ignore
      shelter.orders.push(order._id);
      await shelter.save();

    }

    return order;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    const user = await this.userModel.findById(userId).populate({
      path: 'orders',
      match: { status: { $ne: 'cancelled' } },
    }).exec();
    return user.orders;
  }

  async getSellerOrders(sellerId: string): Promise<Order[]> {
    const seller = await this.shelterModel.findById(sellerId).populate({
      path: 'orders',
    }).exec();
    return seller.orders;
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
