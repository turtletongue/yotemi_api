import { Injectable } from '@nestjs/common';

import FindNotificationsDto from './dto/find-notifications.dto';
import NotificationsRepository from '../notifications.repository';
import { NotificationFactory, PlainNotification } from '../entities';

@Injectable()
export default class FindNotificationsCase {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly notificationFactory: NotificationFactory,
  ) {}

  public async apply(
    dto: FindNotificationsDto,
  ): Promise<{ items: PlainNotification[]; notSeenCount: number }> {
    const result = await this.notificationsRepository.findAll(dto.executor.id);
    const views = await this.notificationsRepository.findViews(
      result.items.map(({ id }) => id),
      dto.executor.id,
    );

    const notSeenCount = await this.notificationsRepository.countNotSeen(
      dto.executor.id,
    );

    return {
      ...result,
      items: this.notificationFactory
        .rebuildManyWithViews(result.items, views)
        .map(({ plain }) => ({
          id: plain.id,
          type: plain.type,
          content: plain.content,
          isSeen: plain.isSeen,
          userId: plain.userId,
          createdAt: plain.createdAt,
          updatedAt: plain.updatedAt,
        })),
      notSeenCount,
    };
  }
}
