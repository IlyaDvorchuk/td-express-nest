import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Order, OrderDocument} from './order.schema';
import {User, UserDocument} from 'src/users/users.schema';
import {CreateOrderDto} from "./dto/create-order.dto";
import {Shelter, ShelterDocument} from "../shelters/shelters.schema";

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Shelter.name) private readonly shelterModel: Model<ShelterDocument>,
  ) {}

  private async pushSellerOrder(shelter: Shelter, order: Order) {
    // @ts-ignore
    shelter.orders.push(order._id);
    await shelter.save();
      const relevantOrderTypes = order.orderTypes.filter(orderType => orderType.shelterId === shelter._id);

      // Вычисляем сумму count только для отфильтрованных orderTypes
      const totalOrderCount = relevantOrderTypes.reduce((sum, orderType) => sum + orderType.count, 0);
      const apiUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT}/sendMessage`;
      const productNames = order.orderTypes.map(orderType => orderType.goodName).join(', ');
      const message = `
          У продавца ${shelter.shop.nameMarket} заказали товар: ${productNames} в количестве ${totalOrderCount} ценой ${order.price}
          
          Данные о покупателе:
          ${order.buyer.name}
          ${order.buyer.family}
          ${order.buyer.phone}
        `
      const payloadIlya = {
        chat_id: '5649067326',
        text: message,
        parse_mode: 'HTML',
      };


      try {
        await fetch(apiUrl, {
          method: 'POST',
          body: JSON.stringify(payloadIlya),
          headers: { 'Content-Type': 'application/json' },
        });

        await fetch(apiUrl, {
          method: 'POST',
          body: JSON.stringify(payloadIlya),
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Error sending message to Telegram:', error);
      }
  }

  async createOrder(orderDto: CreateOrderDto): Promise<Order> {
    const order = await this.orderModel.create(orderDto);
    console.log('order',order)
    const user = await this.userModel.findById(orderDto.userId).exec();

    if (user) {
      // @ts-ignore
      user.orders.push(order._id);
      await user.save();

    }

    const shelters = await this.shelterModel.find({ _id: { $in: orderDto.shelterIds } }).exec();

    for (const shelter of shelters) {
      if (shelter) {
        await this.pushSellerOrder(shelter, order);
      }
    }

    return order;
  }

  async getOrder(orderId: string): Promise<Order> {
    return this.orderModel.findById(orderId).exec();
  }

  async getOrdersMarketDelivery(): Promise<Order[]> {
    return this.orderModel.find({
      deliveryAddress: {$ne: null},
      isTdMarket: true,
    });
  }

  async getOrdersSelfDelivery(): Promise<Order[]> {
    return this.orderModel.find({
      isTdMarket: false,
    });
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    const user = await this.userModel.findById(userId).populate({
      path: 'orders',
      match: { status: { $ne: 'cancelled' } },
    }).exec();
    return user.orders;
  }

  async getSellerOrders(sellerId: string, count?: number): Promise<Order[]> {
    const seller = await this.shelterModel.findById(sellerId).populate({
      path: 'orders',
    }).exec();

    let orders = seller.orders.reverse();

    if (count !== undefined && count >= 0) {
      orders = orders.slice(0, count);
    }

    return orders;
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
