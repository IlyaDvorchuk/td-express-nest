import { Injectable } from "@nestjs/common";
import { CreateGoodDto } from "./dto/create-good.dto";
import { FilesService } from "../files/files.service";

@Injectable()
export class GoodsService {
  constructor(private fileService: FilesService) {
  }

  async create(dto: CreateGoodDto, image) {
    const fileName = await this.fileService.createFile(image)
    // return await this.postRepository.create({...dto, image: fileName})
  }
}
