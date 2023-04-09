import { Module } from '@nestjs/common';

import PrismaModule from '@common/prisma';
import IdentifiersModule from '@common/identifiers';
import PaginationModule from '@common/pagination';
import GatewaysModule from '@common/gateways';
import { NotificationFactory } from './entities';
import NotificationsRepository from './notifications.repository';
import NotificationsGateway from './notifications.gateway';
import notificationUseCases from './use-cases';
import NotificationsController, { notificationServices } from './controllers';

@Module({
  imports: [IdentifiersModule, PaginationModule, PrismaModule, GatewaysModule],
  providers: [
    NotificationFactory,
    NotificationsRepository,
    NotificationsGateway,
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
