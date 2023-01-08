import { Injectable } from '@nestjs/common';

import { Id } from '@app/app.declarations';
import { UserEntity } from '@features/users/entities';
import GetReviewDto from './dto/get-review.dto';
import ListReviewsDto, { ListReviewsParams } from './dto/list-reviews.dto';
import PostReviewDto from './dto/post-review.dto';
import AddReviewCase from '../use-cases/add-review.case';
import GetReviewByIdCase from '../use-cases/get-review-by-id.case';
import FindReviewsCase from '../use-cases/find-reviews.case';

@Injectable()
export default class ReviewsService {
  constructor(
    private readonly getReviewByIdCase: GetReviewByIdCase,
    private readonly findReviewsCase: FindReviewsCase,
    private readonly addReviewCase: AddReviewCase,
  ) {}

  public async getReviewById(id: Id): Promise<GetReviewDto> {
    return await this.getReviewByIdCase.apply(id);
  }

  public async findReviews(params: ListReviewsParams): Promise<ListReviewsDto> {
    return await this.findReviewsCase.apply(params);
  }

  public async addReview(
    dto: PostReviewDto,
    executor: UserEntity,
  ): Promise<GetReviewDto> {
    return await this.addReviewCase.apply({ ...dto, reviewer: executor });
  }
}
