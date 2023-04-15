import { Injectable } from '@nestjs/common';

import { IdentifiersService } from '@common/identifiers';
import { UserFactory } from '@features/users/entities';
import ReviewEntity from '@features/reviews/entities/review.entity';
import BuildReviewDto from './dto/build-review.dto';

@Injectable()
export default class ReviewFactory {
  constructor(
    private readonly identifiers: IdentifiersService,
    private readonly userFactory: UserFactory,
  ) {}

  public async build({
    id = this.identifiers.generate(),
    points,
    comment,
    userId,
    reviewer,
    isModerated = false,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: BuildReviewDto): Promise<ReviewEntity> {
    const reviewerEntity = await this.userFactory.build(reviewer);

    return new ReviewEntity(
      id,
      points,
      comment,
      userId,
      reviewerEntity,
      isModerated,
      createdAt,
      updatedAt,
    );
  }
}
