import { Injectable } from '@nestjs/common';

import MarkAllNotificationsAsSeenDto from './dto/mark-all-notifications-as-seen.dto';
import NotificationsRepository from '../notifications.repository';
import { PlainNotification } from '../entities';

@Injectable()
export default class MarkAllNotificationsAsSeenCase {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  public async apply({
    executor,
  }: MarkAllNotificationsAsSeenDto): Promise<PlainNotification[]> {
    const notifications = await this.notificationsRepository.findAll({
      where: {
        userId: executor.id,
        isSeen: false,
      },
    });

    const results = await this.notificationsRepository.updateMany(
      notifications.map((notification) => notification.id),
      { isSeen: true },
    );

    return results.map(({ plain }) => ({
      id: plain.id,
      type: plain.type,
      content: plain.content,
      isSeen: plain.isSeen,
      userId: plain.userId,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    }));
  }
}
