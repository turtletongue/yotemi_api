import { Injectable } from '@nestjs/common';

import { IdentifiersService } from '@common/identifiers';
import NotificationEntity from './notification.entity';
import BuildNotificationDto from './dto/build-notification.dto';

@Injectable()
export default class NotificationFactory {
  constructor(private readonly identifiers: IdentifiersService) {}

  public async build({
    id = this.identifiers.generate(),
    type,
    content = null,
    isSeen = false,
    userId,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: BuildNotificationDto): Promise<NotificationEntity> {
    return new NotificationEntity(
      id,
      type,
      content,
      isSeen,
      userId,
      createdAt,
      updatedAt,
    );
  }
}
