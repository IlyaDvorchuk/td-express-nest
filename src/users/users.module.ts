import {forwardRef, Global, Module} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from "./users.schema";
import {AuthModule} from "../auth/auth.module";
import { MongooseModule } from "@nestjs/mongoose";
import {FavoriteModule} from "../favorite/favorite.module";
import {CartModule} from "../cart/cart.module";
import { ProductCardsModule } from 'src/productCard/productCard.module';

@Global()
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    MongooseModule.forFeature([
      {name: User.name, schema: UserSchema},
    ]),
    forwardRef(() => AuthModule),
    FavoriteModule,
    CartModule,
    ProductCardsModule
  ],
  exports: [
    UsersService,
    ]
})
export class UsersModule {}
