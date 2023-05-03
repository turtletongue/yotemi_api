import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';

import AddNotificationDto from './dto/add-notification.dto';
import NotificationsRepository from '../notifications.repository';
import { NotificationFactory, PlainNotification } from '../entities';
import NotificationsProducer from '../notifications.producer';

@Injectable()
export default class AddNotificationCase {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly notificationFactory: NotificationFactory,
    private readonly notificationsProducer: NotificationsProducer,
  ) {}

  public async apply(dto: AddNotificationDto): Promise<PlainNotification> {
    const notification = await this.notificationFactory.build(dto);

    if (notification.type === NotificationType.newFollower) {
      const isExists = await this.notificationsRepository.isExists({
        type: NotificationType.newFollower,
        content: {
          path: ['follower', 'id'],
          equals: (dto.content.follower as any)?.id,
        },
        userId: notification.userId,
      });

      if (isExists) {
        return null;
      }
    }

    const { plain } = await this.notificationsRepository.create(
      notification.plain,
    );

    await this.notificationsProducer.sendNotification(plain.userId, plain);

    return {
      id: plain.id,
      type: plain.type,
      content: plain.content,
      isSeen: plain.isSeen,
      userId: plain.userId,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    };
  }
}
