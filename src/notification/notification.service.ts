import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './notification.schema';
import {SheltersService} from "../shelters/shelters.service";
import fetch from 'node-fetch';
import { UsersService } from "../users/users.service";

@Injectable()
export class NotificationService {
  constructor(@InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
              private shelterService: SheltersService,
              private userService: UsersService,
              ){
     }

  async createNotification(userId: string, message: string, isUser?: boolean): Promise<NotificationDocument> {

    const notification = await this.notificationModel.create({ userId, message });
    const answer = isUser ? await this.userService.pushNotificationRefToUser(userId, notification._id)
      : await this.shelterService.pushNotificationRefToShelter(userId, notification._id)
    if (!isUser) {
      const user = await this.shelterService.findById(userId)
      if (user.shelter.isPushTelegram) {
        await this.sendMessage(
          user.shelter.isPushTelegram,
          notification.message
        )
      }
    } else {
      const user = await this.userService.findById(userId)
      if (user.isPushTelegram) {
        await this.sendMessage(
          user.isPushTelegram,
          notification.message
        )
      }
    }

    if (answer && notification) {
      return notification;

    } throw new Error('Не удалсь создать уведомление')
  }

  async markNotificationAsRead(notificationId: string): Promise<NotificationDocument> {
    const notification = await this.notificationModel.findById(notificationId);
    if (!notification) {
      throw new Error('Уведомление не найдено');
    }

    notification.isRead = true;
    return await notification.save();
  }

  async getUserNotifications(userId: string): Promise<NotificationDocument[]> {
    await this.shelterService
    return await this.notificationModel.find({ userId });
  }

  async deleteNotifications(deleteIds: string[]) {
    await this.notificationModel.deleteMany({ _id: { $in: deleteIds } });
  }

  private async sendMessage(chatId: string, message: string): Promise<void> {
    const apiUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT}/sendMessage`;
    const payload = {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    };
    try {
      await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error sending message to Telegram:', error);
    }
  }
}
