import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

import apiConfig from '@config/api.config';
import s3Config from '@config/s3.config';
import { S3Storage } from '@common/s3';
import AdminsModule from '@features/admins';
import PasswordChangingModule from '@features/password-changing';
import AuthenticationModule from '@features/authentication';
import UsersModule from '@features/users';
import TopicsModule from '@features/topics';
import InterviewsModule from '@features/interviews';
import InterviewMessagesModule from '@features/interview-messages';
import ReviewsModule from '@features/reviews';
import NotificationsModule from '@features/notifications';

@Module({
  imports: [
    ConfigModule.forFeature(apiConfig),
    MulterModule.registerAsync({
      imports: [ConfigModule.forFeature(s3Config)],
      useFactory: async (config: ConfigType<typeof s3Config>) => ({
        storage: new S3Storage({
          keyId: config.keyId,
          secretKey: config.secretKey,
          bucket: config.bucket,
          destination: '/content',
        }),
      }),
      inject: [s3Config.KEY],
    }),
    AdminsModule,
    PasswordChangingModule,
    UsersModule,
    AuthenticationModule,
    TopicsModule,
    InterviewsModule,
    InterviewMessagesModule,
    ReviewsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
