import { Injectable } from '@nestjs/common';
import { Notification, NotificationView, Prisma } from '@prisma/client';

import { PaginationResult, PaginationService } from '@common/pagination';
import { PrismaService } from '@common/prisma';
import { Id } from '@app/app.declarations';
import {
  NotificationEntity,
  NotificationFactory,
  PlainNotification,
} from './entities';
import { NotificationNotFoundException } from './exceptions';
import BuildNotificationDto from './entities/dto/build-notification.dto';

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
    options?: Prisma.NotificationFindManyArgs,
  ): Promise<PaginationResult<NotificationEntity> & { notSeenCount: number }> {
    const paginated = await this.paginate.paginate<
      Notification & { views: NotificationView[] }
    >(this.prisma.notification, page, limit, {
      ...(options ?? {}),
      include: {
        views: {
          where: {
            viewerId,
          },
        },
      },
    });

    const notSeenCount = await this.prisma.notification.count({
      where: {
        ...options.where,
        views: {
          none: {
            viewerId,
          },
        },
      },
    });

    return {
      ...paginated,
      notSeenCount,
      items: await Promise.all(
        paginated.items.map(
          async (notification) =>
            await this.notificationFactory.build(
              this.mapToBuildDto(notification),
            ),
        ),
      ),
    };
  }

  public async findAll(
    viewerId: Id,
    options?: Prisma.NotificationFindManyArgs,
  ): Promise<{ items: NotificationEntity[]; notSeenCount: number }> {
    const notifications = await this.prisma.notification.findMany({
      ...(options ?? {}),
      include: {
        views: {
          where: {
            viewerId,
          },
        },
      },
    });

    const notSeenCount = await this.prisma.notification.count({
      where: {
        ...options.where,
        views: {
          none: {
            viewerId,
          },
        },
      },
    });

    return {
      notSeenCount,
      items: await Promise.all(
        notifications.map(
          async (notification) =>
            await this.notificationFactory.build(
              this.mapToBuildDto(notification),
            ),
        ),
      ),
    };
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
