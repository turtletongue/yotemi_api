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
    const result = await this.reviewsRepository.findPaginated(
      dto.page,
      dto.pageSize,
      {
        where: {
          userId: dto.userId,
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
        createdAt: plain.createdAt,
        updatedAt: plain.updatedAt,
      })),
    };
  }
}
