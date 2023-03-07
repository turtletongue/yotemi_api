import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import PrismaModule from '@common/prisma';
import IdentifiersModule from '@common/identifiers';
import PaginationModule from '@common/pagination';
import S3Module from '@common/s3';
import TopicsModule from '@features/topics';
import NotificationsModule from '@features/notifications';
import UsersRepository from './users.repository';
import { UserFactory } from './entities';
import userUseCases from './use-cases';
import AdminsController, {
  FollowingsController,
  userServices,
} from './controller';

@Module({
  imports: [
    IdentifiersModule,
    PaginationModule,
    PrismaModule,
    TopicsModule,
    NotificationsModule,
    MulterModule,
    S3Module,
  ],
  controllers: [AdminsController, FollowingsController],
  providers: [UserFactory, UsersRepository, ...userUseCases, ...userServices],
  exports: [...userUseCases, UserFactory, UsersRepository],
})
export default class UsersModule {}
