import { Injectable } from '@nestjs/common';

import { PaginationResult } from '@common/pagination';
import FindNotificationsDto from './dto/find-notifications.dto';
import NotificationsRepository from '../notifications.repository';
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
      {
        where: {
          userId: dto.executor.id,
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
