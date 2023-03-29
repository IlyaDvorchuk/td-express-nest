import { Injectable } from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { FilesService } from "../files/files.service";

@Injectable()
export class PostsService {
  constructor(private fileService: FilesService) {
  }

  async create(dto: CreatePostDto, image) {
    const fileName = await this.fileService.createFile(image)
    // return await this.postRepository.create({...dto, image: fileName})
  }
}
