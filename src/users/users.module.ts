import {forwardRef, Global, Module} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from "./users.schema";
import {AuthModule} from "../auth/auth.module";
import { MongooseModule } from "@nestjs/mongoose";
import {FavoriteModule} from "../favorite/favorite.module";
import {CartModule} from "../cart/cart.module";
import { NotificationsModule } from 'src/notification/notification.module';
import { JwtStrategy } from "../utils/jwt.strategy";

@Global()
@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  imports: [
    MongooseModule.forFeature([
      {name: User.name, schema: UserSchema},
    ]),
    forwardRef(() => AuthModule),
    FavoriteModule,
    CartModule,
    NotificationsModule
  ],
  exports: [
    UsersService,
    ]
})
export class UsersModule {}
