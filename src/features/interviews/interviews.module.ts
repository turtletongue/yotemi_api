import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import IdentifiersModule from '@common/identifiers';
import PrismaModule from '@common/prisma';
import PaginationModule from '@common/pagination';
import TonModule from '@common/ton';
import S3Module from '@common/s3';
import UsersModule from '@features/users';
import NotificationsModule from '@features/notifications';
import InterviewsRepository from './interviews.repository';
import { InterviewFactory } from './entities';
import interviewUseCases from './use-cases';
import InterviewGarbageCollectorTask from './interview-garbage-collector.task';
import InterviewsController, { interviewServices } from './controller';

@Module({
  imports: [
    IdentifiersModule,
    PrismaModule,
    PaginationModule,
    UsersModule,
    NotificationsModule,
    TonModule,
    ScheduleModule,
    S3Module,
  ],
  controllers: [InterviewsController],
  providers: [
    InterviewFactory,
    InterviewsRepository,
    InterviewGarbageCollectorTask,
    ...interviewUseCases,
    ...interviewServices,
  ],
  exports: [...interviewUseCases, InterviewsRepository],
})
export default class InterviewsModule {}
