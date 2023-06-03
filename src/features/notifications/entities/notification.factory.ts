import { Injectable } from '@nestjs/common';
import { NotificationView } from '@prisma/client';

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
    views = null,
    userId,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: BuildNotificationDto): Promise<NotificationEntity> {
    return new NotificationEntity(
      id,
      type,
      content,
      views && !!views.length,
      userId,
      createdAt,
      updatedAt,
    );
  }

  public async buildMany(
    notifications: BuildNotificationDto[],
  ): Promise<NotificationEntity[]> {
    return await Promise.all(
      notifications.map(async (notification) => await this.build(notification)),
    );
  }

  public rebuildWithViews(
    notification: BuildNotificationDto,
    views: NotificationView[],
  ): NotificationEntity {
    return new NotificationEntity(
      notification.id,
      notification.type,
      notification.content,
      !!views.length,
      notification.userId,
      notification.createdAt,
      notification.updatedAt,
    );
  }

  public rebuildManyWithViews(
    notifications: BuildNotificationDto[],
    views: NotificationView[],
  ): NotificationEntity[] {
    const notificationIdToViews = views.reduce(
      (map, current) => ({
        ...map,
        [current.notificationId]: [
          ...(map[current.notificationId] ?? []),
          current,
        ],
      }),
      {},
    );

    return notifications.map(
      (notification) =>
        new NotificationEntity(
          notification.id,
          notification.type,
          notification.content,
          !!(notificationIdToViews[notification.id] ?? []).length,
          notification.userId,
          notification.createdAt,
          notification.updatedAt,
        ),
    );
  }
}
