import { Injectable } from '@nestjs/common';

import { Id } from '@app/app.declarations';
import ReviewsRepository from '../reviews.repository';
import { PlainReview } from '../entities';

@Injectable()
export default class GetReviewByIdCase {
  constructor(private readonly reviewsRepository: ReviewsRepository) {}

  public async apply(id: Id): Promise<PlainReview> {
    const { plain } = await this.reviewsRepository.findById(id);

    return {
      id: plain.id,
      points: plain.points,
      comment: plain.comment,
      userId: plain.userId,
      reviewer: plain.reviewer,
      isModerated: plain.isModerated,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    };
  }
}
