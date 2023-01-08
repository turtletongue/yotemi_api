import { Injectable } from '@nestjs/common';

import InterviewsRepository from '@features/interviews/interviews.repository';
import AddReviewDto from './dto/add-review.dto';
import ReviewsRepository from '../reviews.repository';
import { PlainReview, ReviewFactory } from '../entities';
import { NotParticipatedToReviewException } from '../exceptions';

@Injectable()
export default class AddReviewCase {
  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    private readonly reviewFactory: ReviewFactory,
    private readonly interviewsRepository: InterviewsRepository,
  ) {}

  public async apply(dto: AddReviewDto): Promise<PlainReview> {
    const isParticipatedInInterview =
      await this.interviewsRepository.isParticipated(
        dto.userId,
        dto.reviewer.id,
      );

    if (!isParticipatedInInterview) {
      throw new NotParticipatedToReviewException();
    }

    const review = await this.reviewFactory.build({
      ...dto,
      reviewer: dto.reviewer.plain,
    });

    const { plain } = await this.reviewsRepository.create(review.plain);

    return {
      id: plain.id,
      points: plain.points,
      comment: plain.comment,
      userId: plain.userId,
      reviewer: plain.reviewer,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    };
  }
}
