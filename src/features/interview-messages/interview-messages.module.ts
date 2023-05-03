import { Module } from '@nestjs/common';

import IdentifiersModule from '@common/identifiers';
import PrismaModule from '@common/prisma';
import PubsubModule from '@common/pubsub';
import InterviewsModule from '@features/interviews';
import InterviewMessagesRepository from './interview-messages.repository';
import InterviewMessagesProducer from './interview-messages.producer';
import { InterviewMessageFactory } from './entities';
import interviewMessageUseCases from './use-cases';
import InterviewMessagesController, {
  interviewMessageServices,
} from './controller';

@Module({
  imports: [IdentifiersModule, PrismaModule, InterviewsModule, PubsubModule],
  controllers: [InterviewMessagesController],
  providers: [
    InterviewMessageFactory,
    InterviewMessagesRepository,
    InterviewMessagesProducer,
    ...interviewMessageUseCases,
    ...interviewMessageServices,
  ],
  exports: [...interviewMessageUseCases, InterviewMessagesRepository],
})
export default class InterviewMessagesModule {}
