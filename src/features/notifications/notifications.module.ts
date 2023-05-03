import { Module } from '@nestjs/common';

import IdentifiersModule from '@common/identifiers';
import PaginationModule from '@common/pagination';
import PrismaModule from '@common/prisma';
import PubsubModule from '@common/pubsub';
import { NotificationFactory } from './entities';
import NotificationsRepository from './notifications.repository';
import NotificationsProducer from './notifications.producer';
import notificationUseCases from './use-cases';
import NotificationsController, { notificationServices } from './controllers';

@Module({
  imports: [IdentifiersModule, PaginationModule, PrismaModule, PubsubModule],
  providers: [
    NotificationFactory,
    NotificationsRepository,
    NotificationsProducer,
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
