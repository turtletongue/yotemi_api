import { Module } from '@nestjs/common';

import IdentifiersModule from '@common/identifiers';
import PrismaModule from '@common/prisma';
import GatewaysModule from '@common/gateways';
import InterviewsModule from '@features/interviews';
import InterviewMessagesRepository from './interview-messages.repository';
import InterviewMessagesGateway from './interview-messages.gateway';
import { InterviewMessageFactory } from './entities';
import interviewMessageUseCases from './use-cases';
import InterviewMessagesController, {
  interviewMessageServices,
} from './controller';

@Module({
  imports: [IdentifiersModule, PrismaModule, InterviewsModule, GatewaysModule],
  controllers: [InterviewMessagesController],
  providers: [
    InterviewMessageFactory,
    InterviewMessagesRepository,
    InterviewMessagesGateway,
    ...interviewMessageUseCases,
    ...interviewMessageServices,
  ],
  exports: [...interviewMessageUseCases, InterviewMessagesRepository],
})
export default class InterviewMessagesModule {}
