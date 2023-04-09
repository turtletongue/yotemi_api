import { Injectable } from '@nestjs/common';

import FindNotificationsDto from './dto/find-notifications.dto';
import NotificationsRepository from '../notifications.repository';
import { FOLLOWING_NOTIFICATIONS } from '../notifications.constants';
import { PlainNotification } from '../entities';

@Injectable()
export default class FindNotificationsCase {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  public async apply(
    dto: FindNotificationsDto,
  ): Promise<{ items: PlainNotification[]; notSeenCount: number }> {
    const result = await this.notificationsRepository.findAll(dto.executor.id, {
      where: {
        views: {
          none: {
            viewerId: dto.executor.id,
          },
        },
        OR: [
          {
            type: {
              notIn: FOLLOWING_NOTIFICATIONS,
            },
            userId: dto.executor.id,
          },
          {
            type: {
              in: FOLLOWING_NOTIFICATIONS,
            },
            user: {
              followers: {
                some: {
                  id: dto.executor.id,
                },
              },
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      ...result,
      items: result.items.map(({ plain }) => ({
        id: plain.id,
        type: plain.type,
        content: plain.content,
        isSeen: plain.isSeen,
        userId: plain.userId,
        createdAt: plain.createdAt,
        updatedAt: plain.updatedAt,
      })),
    };
  }
}
