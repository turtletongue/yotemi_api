import { Injectable } from '@nestjs/common';

import { PaginationResult } from '@common/pagination';
import FindReviewsDto from './dto/find-reviews.dto';
import ReviewsRepository from '../reviews.repository';
import { PlainReview } from '../entities';

@Injectable()
export default class FindReviewsCase {
  constructor(private readonly reviewsRepository: ReviewsRepository) {}

  public async apply(
    dto: FindReviewsDto,
  ): Promise<PaginationResult<PlainReview>> {
    const isUser = !dto.executor || dto.executor.kind === 'user';

    const result = await this.reviewsRepository.findPaginated(
      dto.page,
      dto.pageSize,
      {
        where: {
          userId: dto.userId,
          isModerated: isUser || dto.isModerated,
        },
        orderBy: {
          createdAt: dto.sortDirection,
        },
      },
    );

    return {
      ...result,
      items: result.items.map(({ plain }) => ({
        id: plain.id,
        points: plain.points,
        comment: plain.comment,
        userId: plain.userId,
        reviewer: plain.reviewer,
        isModerated: plain.isModerated,
        createdAt: plain.createdAt,
        updatedAt: plain.updatedAt,
      })),
    };
  }
}
