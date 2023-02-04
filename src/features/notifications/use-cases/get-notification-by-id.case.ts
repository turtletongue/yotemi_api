import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserEntity } from '@features/users/entities';
import { Id } from '@app/app.declarations';
import NotificationsRepository from '../notifications.repository';
import { PlainNotification } from '../entities';

@Injectable()
export default class GetNotificationByIdCase {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  public async apply(id: Id, executor: UserEntity): Promise<PlainNotification> {
    const { plain } = await this.notificationsRepository.findById(id);

    if (plain.userId !== executor.id) {
      throw new UnauthorizedException();
    }

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
