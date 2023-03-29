import {forwardRef, Module} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from "../users/users.module";
import { TokensService } from "../tokens/tokens.service";

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    forwardRef(() => UsersModule),
  ],
  exports: [
      AuthService,
      TokensService,
  ]
})
export class AuthModule {}
