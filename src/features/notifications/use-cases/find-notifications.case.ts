import { Injectable } from '@nestjs/common';

import { PaginationResult } from '@common/pagination';
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
  ): Promise<PaginationResult<PlainNotification>> {
    const result = await this.notificationsRepository.findPaginated(
      dto.page,
      dto.pageSize,
      dto.executor.id,
      {
        where: {
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
      },
    );

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
