import { Module } from '@nestjs/common';

import IdentifiersModule from '@common/identifiers';
import PrismaModule from '@common/prisma';
import InterviewsModule from '@features/interviews';
import InterviewMessagesRepository from './interview-messages.repository';
import { InterviewMessageFactory } from './entities';
import interviewMessageUseCases from './use-cases';
import InterviewMessagesController, {
  interviewMessageServices,
} from './controller';

@Module({
  imports: [IdentifiersModule, PrismaModule, InterviewsModule],
  controllers: [InterviewMessagesController],
  providers: [
    InterviewMessageFactory,
    InterviewMessagesRepository,
    ...interviewMessageUseCases,
    ...interviewMessageServices,
  ],
  exports: [...interviewMessageUseCases, InterviewMessagesRepository],
})
export default class InterviewMessagesModule {}
