import {forwardRef, Module} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from "../users/users.module";
import { TokensModule } from "../tokens/tokens.module";
import { AuthShelterController } from "./auth-shelter.controller";
import { AuthShelterService } from "./auth-shelter.service";
import { SheltersModule } from "../shelters/shelters.module";
import { FilesModule } from "../files/files.module";
import { NestjsFormDataModule } from "nestjs-form-data";

@Module({
  providers: [AuthService, AuthShelterService],
  controllers: [AuthController, AuthShelterController],
  imports: [
    forwardRef(() => UsersModule),
    NestjsFormDataModule,
    TokensModule,
    SheltersModule,
    FilesModule
  ],
  exports: [
      AuthService,
  ]
})
export class AuthModule {}
