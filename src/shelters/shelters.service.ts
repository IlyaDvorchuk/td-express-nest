import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Shelter, ShelterDocument } from "./shelters.schema";
import { CreateShelterDto } from "./dto/create-shelter.dto";
import { ProductCard, ProductCardDocument } from 'src/productCard/productCard.schema';
import { Order, OrderDocument } from 'src/order/order.schema';
import { User, UserDocument } from 'src/users/users.schema';

@Injectable()
export class SheltersService {
  constructor(@InjectModel(Shelter.name) private shelterRepository: Model<ShelterDocument>,
    @InjectModel(ProductCard.name) private readonly productCardModel: Model<ProductCardDocument>,
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
  }

  async getUserByEmail(email: string) {
    return await this.shelterRepository.findOne({ email }).exec();
  }

  async checkShelter(email: string, phone: string) {
    const shelterEmail = await this.shelterRepository.findOne({ email }).exec();
    const shelterPhone = await this.shelterRepository.findOne({ phone }).exec();
    return {
      email: Boolean(shelterEmail),
      phone: Boolean(shelterPhone),
    };
  }

  async createShelter(dto: CreateShelterDto, filename: string, fileNameShop: string) {
    console.log('CreateShelterDto 27', dto)
    console.log('filename 27', filename)
    console.log('fileNameShop 27', fileNameShop)
    return await this.shelterRepository.create({...dto, fileScan: filename, imageShop: fileNameShop})
  }

  async getDeliveryPoints(shelterId: string) {
    const shelter = await this.shelterRepository.findById(shelterId).populate('deliveryPoints').exec();
    return shelter.deliveryPoints;
  }

  async findById(shelterId: string) {
    return this.shelterRepository.findById(shelterId).exec();
  }

  async getCards(shelterId: string, page: number, limit: number) {
    const shelter = await this.shelterRepository
      .findById(shelterId)
      .populate({
        path: 'productCards',
        options: {
          skip: (page - 1) * limit, // Пропустить элементы предыдущих страниц
          limit: limit // Ограничить количество элементов на странице
        }
      })
      .exec();
    return shelter.productCards;
  }

  async addProductCard(shelterId: string, productCard: ProductCard) {
    try {
      const shelter = await this.shelterRepository.findById(shelterId)
      if(!shelter.isVerified){
        productCard.published = false;
      }
      shelter.productCards.push(productCard);
      await shelter.save();
      return true
    }
    catch (e) {
      console.error('\'Error adding product card:\',', e)
      return false
    }
  }

  async getAllShelters(status: string, fromDate: Date, toDate: Date) {
    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (fromDate && toDate) {
      filter.createdAt = { $gte: fromDate, $lte: toDate };
    }

    return this.shelterRepository.find(filter).exec();
  }

  async getOrdersByShelter(shelterId: string): Promise<any[]> {
    const productCards = await this.productCardModel.find({ shelterId }).exec();
    const productCardIds = productCards.map((card) => card._id);

    const orders = await this.orderModel.find({ productId: { $in: productCardIds } }).exec();

    const results = await Promise.all(
      orders.map(async (order) => {
        const user = await this.userModel.findById(order.userId).exec();
        const product = await this.productCardModel.findById(order.productId).exec();

        return {
          user,
          product,
          status: order.status,
          order: order
        };
      })
    );

    return results;
  }

  async updateOrderStatus(orderId: string, newStatus: string): Promise<Order | null> {
    const order = await this.orderModel.findById(orderId).exec();
    if (!order) {
      return null;
    }

    order.status = newStatus;
    await order.save();

    return order;
  }

  async removeProductCardFromShelter(shelterId: string, productCardId: string): Promise<boolean> {
    const result = await this.shelterRepository.updateOne(
        { _id: shelterId },
        { $pull: { productCards: productCardId } },
    );
    return result.modifiedCount > 0;
  }
}
