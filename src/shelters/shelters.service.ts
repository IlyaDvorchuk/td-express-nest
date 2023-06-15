import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Shelter, ShelterDocument } from "./shelters.schema";
import { CreateShelterDto } from "./dto/create-shelter.dto";
import { ProductCard } from 'src/productCard/productCard.schema';

@Injectable()
export class SheltersService {
  constructor(@InjectModel(Shelter.name) private shelterRepository: Model<ShelterDocument>) {
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

  async getCards(shelterId: string) {
    const shelter = await this.shelterRepository.findById(shelterId).populate('productCards').exec();
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

}
