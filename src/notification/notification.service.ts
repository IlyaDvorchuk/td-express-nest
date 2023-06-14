import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './notification.schema';

@Injectable()
export class NotificationService {
  constructor(@InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,){
     }

  async createNotification(userId: string, message: string): Promise<NotificationDocument> {
    const notification = new this.notificationModel({ userId, message });
    return await notification.save();
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
    return await this.notificationModel.find({ userId });
  }
}
