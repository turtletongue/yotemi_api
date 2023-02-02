import { Injectable, UnauthorizedException } from '@nestjs/common';

import MarkNotificationAsSeenDto from './dto/mark-notification-as-seen.dto';
import { NotificationFactory, PlainNotification } from '../entities';
import NotificationsRepository from '../notifications.repository';

@Injectable()
export default class MarkNotificationAsSeenCase {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly notificationFactory: NotificationFactory,
  ) {}

  public async apply({
    id,
    executor,
  }: MarkNotificationAsSeenDto): Promise<PlainNotification> {
    const existingProperties = await this.notificationsRepository.findById(id);

    if (existingProperties.userId !== executor.id) {
      throw new UnauthorizedException();
    }

    const notification = await this.notificationFactory.build({
      ...existingProperties.plain,
      isSeen: true,
    });

    const { plain } = await this.notificationsRepository.update(
      notification.plain,
    );

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
