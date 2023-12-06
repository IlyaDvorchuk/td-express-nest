import { Module } from "@nestjs/common";
import { UsersModule } from './users/users.module';
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from "@nestjs/serve-static";
import { MailModule } from './mail/mail.module';
import { TokensModule } from './tokens/tokens.module';
import * as path from "path";
import { MongooseModule } from "@nestjs/mongoose";
import { CategoriesModule } from './categories/categories.module';
import { SheltersModule } from './shelters/shelters.module';
import { MulterModule } from "@nestjs/platform-express";
import { ProductCardsModule } from "./productCard/productCard.module";
import { FavoriteModule } from "./favorite/favorite.module";
import { CartModule } from "./cart/cart.module";
import { NotificationsModule } from "./notification/notification.module";
import { QuestionModule } from "./questionary/questionary.module";
import {AdminModule} from "./admin/admin.module";
import { PaymentCallbackModule } from './payment-callback/payment-callback.module';
import { DeliveryModule } from './delivery/delivery.module';
import { OrderModule } from "./order/order.module";
import { ColorsModule } from './colors/colors.module';
import { SuccessPaymentModule } from './success-payment/success-payment.module';
import {ReviewsModule} from "./reviews/reviews.module";

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'static'),
    }),
    MongooseModule.forRoot(process.env.DB_URL, {
      connectionFactory: (connection) => {
        return connection;
      }
    }),
    MulterModule.register({
      dest: './static',
      limits: {
        fileSize: 1024 * 1024 * 1024 * 1000
      }
    }),
    UsersModule,
    AuthModule,
    FilesModule,
    MailModule,
    TokensModule,
    CategoriesModule,
    SheltersModule,
    ProductCardsModule,
    FavoriteModule,
    CartModule,
    NotificationsModule,
    QuestionModule,
    AdminModule,
    PaymentCallbackModule,
    DeliveryModule,
    OrderModule,
    ColorsModule,
    SuccessPaymentModule,
      ReviewsModule,
  ]
})

export class AppModule {
  constructor() {
    //initializeProductStatuses(); // Вызов функции initializeProductStatuses() в конструкторе модуля
  }
}

// async function initializeProductStatuses() {
//   const statuses = [
//     { name: 'Ожидает подтверждения' },
//     { name: 'Ожидает отправки' },
//     { name: 'В процессе доставки' },
//     { name: 'Заказ завершен' },
//   ];

//   try {
//     await ProductStatusModel.create(statuses);
//     console.log('Статусы товаров успешно проинициализированы.');
//   } catch (error) {
//     console.error('Ошибка при инициализации статусов товаров:', error);
//   }
// }
