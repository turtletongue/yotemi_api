import { Module } from '@nestjs/common';

import IdentifiersModule from '@common/identifiers';
import PrismaModule from '@common/prisma';
import UsersModule from '@features/users';
import InterviewsRepository from './interviews.repository';
import { InterviewFactory } from './entities';
import interviewUseCases from './use-cases';
import InterviewsController, { interviewServices } from './controller';

@Module({
  imports: [IdentifiersModule, PrismaModule, UsersModule],
  controllers: [InterviewsController],
  providers: [
    InterviewFactory,
    InterviewsRepository,
    ...interviewUseCases,
    ...interviewServices,
  ],
  exports: [...interviewUseCases, InterviewsRepository],
})
export default class InterviewsModule {}
