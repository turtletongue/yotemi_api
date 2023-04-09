import { Injectable } from '@nestjs/common';

import MarkAllNotificationsAsSeenDto from './dto/mark-all-notifications-as-seen.dto';
import NotificationsRepository from '../notifications.repository';
import { PlainNotification } from '../entities';
import { FOLLOWING_NOTIFICATIONS } from '../notifications.constants';
import NotificationsGateway from '../notifications.gateway';

@Injectable()
export default class MarkAllNotificationsAsSeenCase {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  public async apply({
    executor,
  }: MarkAllNotificationsAsSeenDto): Promise<PlainNotification[]> {
    const notifications = await this.notificationsRepository.findAll(
      executor.id,
      {
        where: {
          OR: [
            {
              type: {
                notIn: FOLLOWING_NOTIFICATIONS,
              },
              userId: executor.id,
            },
            {
              type: {
                in: FOLLOWING_NOTIFICATIONS,
              },
              user: {
                followers: {
                  some: {
                    id: executor.id,
                  },
                },
              },
            },
          ],
        },
      },
    );

    const results = await this.notificationsRepository.markAllAsSeen(
      notifications.items.map((notification) => notification.id),
      executor.id,
    );

    results.forEach((result) => {
      this.notificationsGateway.updateNotification(result.userId, result.plain);
    });

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
