import { Injectable } from '@nestjs/common';

import ModerateReviewDto from './dto/moderate-review.dto';
import ReviewsRepository from '../reviews.repository';
import { PlainReview } from '../entities';

@Injectable()
export default class ModerateReviewCase {
  constructor(private readonly reviewsRepository: ReviewsRepository) {}

  public async apply(dto: ModerateReviewDto): Promise<PlainReview> {
    const review = await this.reviewsRepository.findById(dto.id);
    review.comment = dto.comment;

    return this.reviewsRepository.update(review).then(({ plain }) => plain);
  }
}
