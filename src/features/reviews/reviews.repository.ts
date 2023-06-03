import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@common/prisma';
import { PaginationResult, PaginationService } from '@common/pagination';
import { Id } from '@app/app.declarations';
import { PlainReview, ReviewEntity, ReviewFactory } from './entities';
import BuildReviewDto from './entities/dto/build-review.dto';
import { ReviewNotFoundException } from './exceptions';

const includeReviewerOptions = {
  include: {
    topics: {
      include: {
        labels: {
          select: {
            id: true,
            value: true,
            language: true,
          },
        },
      },
    },
  },
};

@Injectable()
export default class ReviewsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pagination: PaginationService,
    private readonly reviewFactory: ReviewFactory,
  ) {}

  public async findById(id: Id): Promise<ReviewEntity> {
    const review = await this.prisma.review
      .findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          reviewer: includeReviewerOptions,
        },
      })
      .catch(() => {
        throw new ReviewNotFoundException();
      });

    return await this.reviewFactory.build(review);
  }

  public async isExist(userId: Id, reviewerId: Id): Promise<boolean> {
    const review = await this.prisma.review.findFirst({
      where: {
        userId,
        reviewerId,
      },
    });

    return !!review;
  }

  public async findPaginated(
    page: number,
    limit: number,
    options?: Prisma.ReviewFindManyArgs,
  ): Promise<PaginationResult<ReviewEntity>> {
    const paginated = await this.pagination.paginate<BuildReviewDto>(
      this.prisma.review,
      page,
      limit,
      {
        ...(options ?? {}),
        include: {
          reviewer: includeReviewerOptions,
        },
      },
    );

    return {
      ...paginated,
      items: await this.reviewFactory.buildMany(paginated.items),
    };
  }

  public async create(review: PlainReview): Promise<ReviewEntity> {
    const { reviewer, ...data } = review;

    const result = await this.prisma.review.create({
      data: {
        ...data,
        reviewerId: reviewer.id,
      },
      include: {
        reviewer: includeReviewerOptions,
      },
    });

    return await this.reviewFactory.build(result);
  }

  public async update(
    review: Partial<PlainReview> & Pick<PlainReview, 'id'>,
  ): Promise<ReviewEntity> {
    const existingReview = await this.findById(review.id);

    const { reviewer, ...data } = review;

    const result = await this.prisma.review.update({
      where: {
        id: existingReview.id,
      },
      data: {
        ...data,
        reviewerId: reviewer.id,
      },
      include: {
        reviewer: includeReviewerOptions,
      },
    });

    return await this.reviewFactory.build(result);
  }

  public async delete(id: Id): Promise<ReviewEntity> {
    const existingReview = await this.findById(id);

    const result = await this.prisma.review.delete({
      where: {
        id: existingReview.id,
      },
      include: {
        reviewer: includeReviewerOptions,
      },
    });

    return await this.reviewFactory.build(result);
  }
}
