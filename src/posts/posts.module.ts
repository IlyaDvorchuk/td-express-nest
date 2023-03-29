import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { FilesModule } from "../files/files.module";

@Module({
  providers: [PostsService],
  controllers: [PostsController],
  imports: [
    FilesModule
  ]
})
export class PostsModule {}
