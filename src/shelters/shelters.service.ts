import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Shelter, ShelterDocument } from "./shelters.schema";
import { CreateShelterDto } from "./dto/create-shelter.dto";

@Injectable()
export class SheltersService {
  constructor(@InjectModel(Shelter.name) private shelterRepository: Model<ShelterDocument>) {
  }

  async getUserByEmail(email: string) {
    return this.shelterRepository.findOne({ email }).exec();
  }

  async createShelter(dto: CreateShelterDto, filename: string, fileNameShop: string) {
    console.log('shelterDto', dto);

    return await this.shelterRepository.create({...dto, fileScan: filename, imageShop: fileNameShop})
  }

  async getDeliveryPoints(shelterId: string) {
    const shelter = await this.shelterRepository.findById(shelterId).populate('deliveryPoints').exec();
    console.log('shelter', shelter);
    return shelter.deliveryPoints;
  }

  async findById(shelterId: string) {
    return this.shelterRepository.findById(shelterId).exec();
  }

  async addProductCard(shelterId: string, productCard) {
    try {
      const shelter = await this.shelterRepository.findById(shelterId)
      shelter.productCards.push(productCard);
      await shelter.save();
      return true
    }
    catch (e) {
      console.error('\'Error adding product card:\',', e)
      return false
    }
  }

}
