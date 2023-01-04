import { Module } from '@nestjs/common';

import PrismaModule from '@common/prisma';
import IdentifiersModule from '@common/identifiers';
import PaginationModule from '@common/pagination';
import TopicsRepository from './topics.repository';
import { TopicFactory } from './entities';
import topicUseCases from './use-cases';
import TopicsController, { topicServices } from './controller';

@Module({
  imports: [IdentifiersModule, PaginationModule, PrismaModule],
  providers: [
    TopicFactory,
    TopicsRepository,
    ...topicUseCases,
    ...topicServices,
  ],
  controllers: [TopicsController],
  exports: [...topicUseCases, TopicFactory, TopicsRepository],
})
export default class TopicsModule {}
