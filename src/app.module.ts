import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import apiConfig from '@config/api.config';
import AdminsModule from '@features/admins';
import PasswordChangingModule from '@features/password-changing';
import AuthenticationModule from '@features/authentication';
import UsersModule from '@features/users';
import TopicsModule from '@features/topics';
import InterviewsModule from '@features/interviews';
import InterviewMessagesModule from '@features/interview-messages';
import ReviewsModule from '@features/reviews';

@Module({
  imports: [
    ConfigModule.forFeature(apiConfig),
    AdminsModule,
    PasswordChangingModule,
    UsersModule,
    AuthenticationModule,
    TopicsModule,
    InterviewsModule,
    InterviewMessagesModule,
    ReviewsModule,
  ],
})
export class AppModule {}
