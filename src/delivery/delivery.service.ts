import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateDeliveryDto, DeliveryItemDto } from "./dto/delivery.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { City, CityDocument, Delivery, DeliveryDocument } from "./delivery.schema";
import {Shelter, ShelterDocument} from "../shelters/shelters.schema";
import {MARKET_DELIVERY} from "../constants/constants";

@Injectable()
export class DeliveryService {
  constructor(
    @InjectModel(Delivery.name) private deliveryRepository: Model<DeliveryDocument>,
    @InjectModel(City.name) private cityRepository: Model<CityDocument>,
    @InjectModel(Shelter.name) private shelterRepository: Model<ShelterDocument>,

  ) {
  }

  async updateDelivery(shelterId: string, delivery: CreateDeliveryDto) {
    try {
      const deliveryShelter = await this.deliveryRepository.findOne({ shelterId });

      if (!deliveryShelter) {
        return await this.deliveryRepository.create({
          shelterId,
          cities: delivery.deliveryPoints
        })
      } else {
        // Если объект существует, обновляем поле delivery
        deliveryShelter.cities = await this.convertDeliveryItemsToCities(delivery.deliveryPoints);
        await deliveryShelter.save()
        return deliveryShelter
      }
    } catch (e) {
      throw new HttpException(

        'Не удается обновить или создать: ' + e.message,
        HttpStatus.BAD_REQUEST
      )
    }


  }

  private async convertDeliveryItemToCity(deliveryItem: DeliveryItemDto) {
    return await this.cityRepository.create({
      city: deliveryItem.city,
      price: deliveryItem.price
    });
  }

  private async convertDeliveryItemsToCities(deliveryItems: DeliveryItemDto[]) {
    const cities = [];

    for (const deliveryItem of deliveryItems) {
      const city = await this.convertDeliveryItemToCity(deliveryItem);
      cities.push(city);
    }
    return cities
  }

  async getDeliveryCities(shelterId: string) {
    const deliveryShelter = await this.deliveryRepository.findOne({ shelterId });

    const seller = await this.shelterRepository.findById(shelterId)
    if (!deliveryShelter || seller?.rate === 'td-delivery' || deliveryShelter.cities.length === 0) {
      return MARKET_DELIVERY
    }


    return deliveryShelter.cities
  }

  async getDeliveryCitiesCart(sellerIds: string[]) {
    const sellers = await this.shelterRepository.find({ where: { sellerIds } });
    console.log()
    const allSellersHaveRate = sellers.every(seller => seller.rate === 'td-delivery');

    if (allSellersHaveRate) {
      return {
        cities: MARKET_DELIVERY,
        rate: 'td-delivery'
      };
    }

    if (sellers.length === 1 && (sellers[0].rate === 'self-delivery')) {
      const deliveryShelter = await this.deliveryRepository.findOne({ shelterId: sellers[0]._id });
      return deliveryShelter ? {
        cities: deliveryShelter.cities,
        rate: 'self-delivery'
      } : {
        cities: MARKET_DELIVERY,
        rate: 'td-delivery'
      }
    }

    return 'у продавцов разные тарифы';
  }
}
