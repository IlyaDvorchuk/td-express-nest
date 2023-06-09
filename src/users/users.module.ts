import {forwardRef, Module} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from "./users.schema";
import {AuthModule} from "../auth/auth.module";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    MongooseModule.forFeature([
      {name: User.name, schema: UserSchema}
    ]),
    forwardRef(() => AuthModule),

  ],
  exports: [
      UsersService,
  ]
})
export class UsersModule {}
