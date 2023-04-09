import { ForbiddenException, Injectable } from '@nestjs/common';

import MarkNotificationAsSeenDto from './dto/mark-notification-as-seen.dto';
import NotificationsRepository from '../notifications.repository';
import { PlainNotification } from '../entities';
import NotificationsGateway from '../notifications.gateway';

@Injectable()
export default class MarkNotificationAsSeenCase {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  public async apply({
    id,
    executor,
  }: MarkNotificationAsSeenDto): Promise<PlainNotification> {
    const notification = await this.notificationsRepository.findById(
      id,
      executor.id,
    );

    if (notification.userId !== executor.id) {
      throw new ForbiddenException();
    }

    const { plain } = await this.notificationsRepository.markAsSeen(
      notification.id,
      executor.id,
    );

    this.notificationsGateway.updateNotification(plain.userId, plain);

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
