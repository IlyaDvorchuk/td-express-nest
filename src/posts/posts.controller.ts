import { Body, Controller, Post, UploadedFiles } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";

@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {
  }

  @Post()
  createPost(@Body() dto: CreatePostDto,
              @UploadedFiles() image) {
      this.postService.create(dto, image)
  }
}
