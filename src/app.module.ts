import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import apiConfig from '@config/api.config';
import AdminsModule from '@features/admins';
import PasswordChangingModule from '@features/password-changing';
import AuthenticationModule from '@features/authentication';
import UsersModule from '@features/users';
import TopicsModule from '@features/topics';
import InterviewsModule from '@features/interviews';
import InterviewMessagesModule from '@features/interview-messages';
import ReviewsModule from '@features/reviews';
import NotificationsModule from '@features/notifications';
import PeersModule from '@features/peers';

@Module({
  imports: [
    ConfigModule.forFeature(apiConfig),
    ScheduleModule.forRoot(),
    AdminsModule,
    PasswordChangingModule,
    UsersModule,
    AuthenticationModule,
    TopicsModule,
    InterviewsModule,
    InterviewMessagesModule,
    ReviewsModule,
    NotificationsModule,
    PeersModule,
  ],
})
export class AppModule {}
