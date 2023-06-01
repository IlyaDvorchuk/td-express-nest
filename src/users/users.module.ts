import {forwardRef, Global, Module} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from "./users.schema";
import {AuthModule} from "../auth/auth.module";
import { MongooseModule } from "@nestjs/mongoose";
import {FavoriteService} from "../favorite/favorite.service";
import {CartService} from "../cart/cart.service";

@Global()
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    MongooseModule.forFeature([
      {name: User.name, schema: UserSchema}
    ]),
    forwardRef(() => AuthModule),
    FavoriteService,
    CartService
  ],
  exports: [
    UsersService,

  ]
})
export class UsersModule {}
