import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import IdentifiersModule from '@common/identifiers';
import PrismaModule from '@common/prisma';
import TonModule from '@common/ton';
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
    UsersModule,
    NotificationsModule,
    TonModule,
    ScheduleModule,
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
