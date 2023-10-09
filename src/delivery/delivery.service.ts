import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateDeliveryDto, DeliveryItemDto } from "./dto/delivery.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { City, CityDocument, Delivery, DeliveryDocument } from "./delivery.schema";

@Injectable()
export class DeliveryService {
  constructor(
    @InjectModel(Delivery.name) private deliveryRepository: Model<DeliveryDocument>,
    @InjectModel(City.name) private cityRepository: Model<CityDocument>,
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

    if (!deliveryShelter) {
      throw new HttpException(

        'Не удалось найти доставку продавца',
        HttpStatus.BAD_REQUEST
      )
    }

    return deliveryShelter.cities
  }
}
