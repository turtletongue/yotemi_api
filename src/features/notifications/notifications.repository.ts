import { Notification, Prisma } from '@prisma/client';

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

export default class NotificationsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginate: PaginationService,
    private readonly notificationFactory: NotificationFactory,
  ) {}

  public async findById(id: Id): Promise<NotificationEntity> {
    const notification = await this.prisma.notification
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .catch(() => {
        throw new NotificationNotFoundException();
      });

    return await this.notificationFactory.build(
      this.mapToBuildDto(notification),
    );
  }

  public async findPaginated(
    page: number,
    limit: number,
    options?: Prisma.NotificationFindManyArgs,
  ): Promise<PaginationResult<NotificationEntity>> {
    const paginated = await this.paginate.paginate<Notification>(
      this.prisma.notification,
      page,
      limit,
      options,
    );

    return {
      ...paginated,
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

  public async create(
    notification: PlainNotification,
  ): Promise<NotificationEntity> {
    const result = await this.prisma.notification.create({
      data: {
        ...notification,
        content: notification.content as Prisma.JsonObject | null,
      },
    });

    return await this.notificationFactory.build(this.mapToBuildDto(result));
  }

  public async update(
    notification: Partial<PlainNotification> & Pick<PlainNotification, 'id'>,
  ): Promise<NotificationEntity> {
    const existingNotification = await this.findById(notification.id);

    const result = await this.prisma.notification.update({
      where: {
        id: notification.id,
      },
      data: {
        ...notification,
        content: notification.content as Prisma.JsonObject | null,
      },
    });

    return await this.notificationFactory.build(this.mapToBuildDto(result));
  }

  public async updateMany(
    ids: Id[],
    data: Partial<PlainNotification>,
  ): Promise<NotificationEntity[]> {
    await this.prisma.notification.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        ...data,
        content: data.content as Prisma.JsonObject | null | undefined,
      },
    });

    const results = await this.prisma.notification.findMany({
      where: {
        id: {
          in: ids,
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

  public async delete(id: Id): Promise<NotificationEntity> {
    const existingNotification = await this.findById(id);

    const result = await this.prisma.notification.delete({
      where: {
        id: existingNotification.id,
      },
    });

    return await this.notificationFactory.build(this.mapToBuildDto(result));
  }

  private mapToBuildDto(notification: Notification): BuildNotificationDto {
    return {
      ...notification,
      content: notification.content as Record<string, unknown> | null,
    };
  }
}
