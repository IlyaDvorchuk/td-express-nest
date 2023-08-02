import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './notification.schema';
import { NotificationService } from './notification.service';
import {SheltersModule} from "../shelters/shelters.module";

@Module({
  controllers: [],
  providers: [NotificationService],
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
      SheltersModule
  ],
  exports: [NotificationService],
})
export class NotificationsModule {}
