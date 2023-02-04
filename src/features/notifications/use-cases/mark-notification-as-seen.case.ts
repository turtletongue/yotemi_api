import { Injectable, UnauthorizedException } from '@nestjs/common';

import MarkNotificationAsSeenDto from './dto/mark-notification-as-seen.dto';
import { PlainNotification } from '../entities';
import NotificationsRepository from '../notifications.repository';

@Injectable()
export default class MarkNotificationAsSeenCase {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  public async apply({
    id,
    executor,
  }: MarkNotificationAsSeenDto): Promise<PlainNotification> {
    const notification = await this.notificationsRepository.findById(id);

    if (notification.userId !== executor.id) {
      throw new UnauthorizedException();
    }

    notification.isSeen = true;

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
