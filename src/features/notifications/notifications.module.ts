import { Module } from '@nestjs/common';

import PrismaModule from '@common/prisma';
import IdentifiersModule from '@common/identifiers';
import PaginationModule from '@common/pagination';
import { NotificationFactory } from './entities';
import NotificationsRepository from './notifications.repository';
import notificationUseCases from './use-cases';
import NotificationsController, { notificationServices } from './controllers';

@Module({
  imports: [IdentifiersModule, PaginationModule, PrismaModule],
  providers: [
    NotificationFactory,
    NotificationsRepository,
    ...notificationUseCases,
    ...notificationServices,
  ],
  controllers: [NotificationsController],
  exports: [
    ...notificationUseCases,
    NotificationFactory,
    NotificationsRepository,
  ],
})
export default class NotificationsModule {}
