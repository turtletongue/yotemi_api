import { Injectable } from '@nestjs/common';
import { Notification, NotificationView, Prisma } from '@prisma/client';

import { PaginationResult, PaginationService } from '@common/pagination';
import { PrismaService } from '@common/prisma';
import { Id, Model } from '@app/app.declarations';
import {
  NotificationEntity,
  NotificationFactory,
  PlainNotification,
} from './entities';
import { NotificationNotFoundException } from './exceptions';
import BuildNotificationDto from './entities/dto/build-notification.dto';
import { FOLLOWING_NOTIFICATIONS } from './notifications.constants';

const getRawNotificationsWhere = (viewerId: Id) => Prisma.sql`
    WHERE NOT EXISTS((
        SELECT id
        FROM notification_views
        WHERE "notificationId" = notifications.id AND
              "viewerId" = ${viewerId}
    )) AND (
        (
            type::text NOT IN (${Prisma.join(FOLLOWING_NOTIFICATIONS)}) AND
            "userId" = ${viewerId}
        ) OR (
            type::text IN (${Prisma.join(FOLLOWING_NOTIFICATIONS)}) AND
            EXISTS((
                SELECT *
                FROM subscriptions
                WHERE "followingId" = notifications."userId" AND
                      "followerId" = ${viewerId} AND
                      "createdAt" <= notifications."createdAt"
            ))
        )
    )
`;

@Injectable()
export default class NotificationsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginate: PaginationService,
    private readonly notificationFactory: NotificationFactory,
  ) {}

  public async findById(id: Id, viewerId: Id): Promise<NotificationEntity> {
    const notification = await this.prisma.notification
      .findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          views: {
            where: {
              viewerId,
            },
          },
        },
      })
      .catch(() => {
        throw new NotificationNotFoundException();
      });

    return await this.notificationFactory.build(
      this.mapToBuildDto(notification),
    );
  }

  public async isExists(
    where: Prisma.NotificationWhereInput,
  ): Promise<boolean> {
    const notification = await this.prisma.notification.findFirst({
      where,
    });

    return !!notification;
  }

  public async findPaginated(
    page: number,
    limit: number,
    viewerId: Id,
  ): Promise<PaginationResult<NotificationEntity>> {
    const rawModel = {
      findMany: ({ take, skip }: Prisma.NotificationFindManyArgs) => {
        return this.prisma.$queryRaw`
            SELECT *
            FROM notifications
            ${getRawNotificationsWhere(viewerId)}
            LIMIT ${take}
            OFFSET ${skip}
        `;
      },
      aggregate: () => {
        return this.prisma.$queryRaw`
            SELECT COUNT(id)
            FROM notifications
            ${getRawNotificationsWhere(viewerId)}
        `;
      },
    } as const;

    const paginated = await this.paginate.paginate<Notification>(
      rawModel as Pick<Model, 'findMany' | 'aggregate'>,
      page,
      limit,
    );

    return {
      ...paginated,
      items: await this.notificationFactory.buildMany(
        paginated.items.map(this.mapToBuildDto),
      ),
    };
  }

  public async findAll(viewerId: Id): Promise<{ items: NotificationEntity[] }> {
    const notifications: Notification[] = await this.prisma.$queryRaw`
      SELECT *
      FROM notifications
      ${getRawNotificationsWhere(viewerId)}
      ORDER BY "createdAt" DESC
    `;

    return {
      items: await this.notificationFactory.buildMany(
        notifications.map(this.mapToBuildDto),
      ),
    };
  }

  public async findViews(
    notificationsIds: Id[],
    viewerId: Id,
  ): Promise<NotificationView[]> {
    return await this.prisma.notificationView.findMany({
      where: {
        notificationId: {
          in: notificationsIds,
        },
        viewerId,
      },
    });
  }

  public async countNotSeen(viewerId: Id): Promise<number> {
    const [{ count }]: [{ count: number }] = await this.prisma.$queryRaw`
        SELECT COUNT(id)
        FROM notifications
        ${getRawNotificationsWhere(viewerId)}
    `;

    return count;
  }

  public async create(
    notification: PlainNotification,
  ): Promise<NotificationEntity> {
    const result = await this.prisma.notification.create({
      data: {
        id: notification.id,
        type: notification.type,
        content: notification.content as Prisma.JsonObject | null,
        userId: notification.userId,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
      },
      include: {
        views: true,
      },
    });

    return await this.notificationFactory.build(this.mapToBuildDto(result));
  }

  public async markAsSeen(id: Id, viewerId: Id): Promise<NotificationEntity> {
    const existingNotification = await this.findById(id, viewerId);

    const result = await this.prisma.notification.update({
      where: {
        id: existingNotification.id,
      },
      data: {
        views: {
          create: {
            viewerId,
          },
        },
      },
      include: {
        views: {
          where: {
            viewerId,
          },
        },
      },
    });

    return await this.notificationFactory.build(this.mapToBuildDto(result));
  }

  public async markAllAsSeen(
    ids: Id[],
    viewerId: Id,
  ): Promise<NotificationEntity[]> {
    await this.prisma.notificationView.createMany({
      data: ids.map((id) => ({
        notificationId: id,
        viewerId,
      })),
    });

    const results = await this.prisma.notification.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        views: {
          where: {
            viewerId,
          },
        },
      },
    });

    return await Promise.all(
      results.map(
        async (notification) =>
          await this.notificationFactory.build(
            this.mapToBuildDto(notification),
          ),
      ),
    );
  }

  private mapToBuildDto(
    notification: Notification & { views: NotificationView[] },
  ): BuildNotificationDto {
    return {
      ...notification,
      content: notification.content as Record<string, unknown> | null,
    };
  }
}
