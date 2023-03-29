import { Module } from "@nestjs/common";
import { UsersModule } from './users/users.module';
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from "@nestjs/serve-static";
import { MailModule } from './mail/mail.module';
import { TokensModule } from './tokens/tokens.module';
import * as path from "path";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    ServeStaticModule.forRootAsync({
      useFactory: () => [{
        rootPath: path.resolve(__dirname, 'static'),
      }]
    }),
    MongooseModule.forRoot(process.env.DB_URL),
    UsersModule,
    AuthModule,
    PostsModule,
    FilesModule,
    MailModule,
    TokensModule,
  ]
})
export class AppModule {

}