import { Injectable } from '@nestjs/common';

import ReviewsRepository from '@features/reviews/reviews.repository';
import CheckReviewExistenceDto from './dto/check-review-existence.dto';

@Injectable()
export default class CheckReviewExistenceCase {
  constructor(private readonly reviewsRepository: ReviewsRepository) {}

  public async apply({
    userId,
    executor,
  }: CheckReviewExistenceDto): Promise<{ isExist: boolean }> {
    const isExist = await this.reviewsRepository.isExist(userId, executor.id);

    return { isExist };
  }
}
