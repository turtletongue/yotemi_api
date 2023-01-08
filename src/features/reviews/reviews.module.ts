import { Module } from '@nestjs/common';

import IdentifiersModule from '@common/identifiers';
import PaginationModule from '@common/pagination';
import PrismaModule from '@common/prisma';
import InterviewsModule from '@features/interviews';
import UsersModule from '@features/users';
import ReviewsRepository from './reviews.repository';
import { ReviewFactory } from './entities';
import reviewUseCases from './use-cases';
import ReviewsController, { reviewServices } from './controller';

@Module({
  imports: [
    IdentifiersModule,
    PaginationModule,
    PrismaModule,
    InterviewsModule,
    UsersModule,
  ],
  controllers: [ReviewsController],
  providers: [
    ReviewFactory,
    ReviewsRepository,
    ...reviewUseCases,
    ...reviewServices,
  ],
  exports: [...reviewUseCases, ReviewFactory, ReviewsRepository],
})
export default class ReviewsModule {}
