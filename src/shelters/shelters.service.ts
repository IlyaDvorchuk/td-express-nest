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
    return this.shelterRepository.findOne({ email });
  }

  async createShelter(dto: CreateShelterDto, filename: string) {
    return await this.shelterRepository.create({...dto, photo: filename})
  }
}
