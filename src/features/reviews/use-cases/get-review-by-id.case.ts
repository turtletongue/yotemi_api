import { Injectable } from '@nestjs/common';

import { S3Service } from '@common/s3';
import { Id } from '@app/app.declarations';
import ReviewsRepository from '../reviews.repository';
import { PlainReview } from '../entities';

@Injectable()
export default class GetReviewByIdCase {
  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    private readonly s3: S3Service,
  ) {}

  public async apply(id: Id): Promise<PlainReview> {
    const { plain } = await this.reviewsRepository.findById(id);

    return {
      id: plain.id,
      points: plain.points,
      comment: plain.comment,
      userId: plain.userId,
      reviewer: {
        ...plain.reviewer,
        avatarPath:
          plain.reviewer.avatarPath &&
          this.s3.getReadPath(plain.reviewer.avatarPath),
        coverPath:
          plain.reviewer.avatarPath &&
          this.s3.getReadPath(plain.reviewer.avatarPath),
      },
      isModerated: plain.isModerated,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    };
  }
}
