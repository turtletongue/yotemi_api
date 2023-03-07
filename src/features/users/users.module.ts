import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

import s3Config from '@config/s3.config';
import PrismaModule from '@common/prisma';
import IdentifiersModule from '@common/identifiers';
import PaginationModule from '@common/pagination';
import S3Module, { S3Storage } from '@common/s3';
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
    MulterModule.registerAsync({
      imports: [ConfigModule.forFeature(s3Config)],
      useFactory: async (config: ConfigType<typeof s3Config>) => ({
        storage: new S3Storage({
          keyId: config.keyId,
          secretKey: config.secretKey,
          bucket: config.bucket,
          destination: '/users',
        }),
      }),
      inject: [s3Config.KEY],
    }),
    IdentifiersModule,
    PaginationModule,
    PrismaModule,
    TopicsModule,
    NotificationsModule,
    S3Module,
  ],
  controllers: [AdminsController, FollowingsController],
  providers: [UserFactory, UsersRepository, ...userUseCases, ...userServices],
  exports: [...userUseCases, UserFactory, UsersRepository],
})
export default class UsersModule {}
