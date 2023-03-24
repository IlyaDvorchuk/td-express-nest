import { Body, Controller, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createPost(@Body() dto: CreatePostDto,
              @UploadedFiles() image) {
      return this.postService.create(dto, image)
  }
}
