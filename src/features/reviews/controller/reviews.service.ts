import { Injectable } from '@nestjs/common';

import { UserEntity } from '@features/users/entities';
import { Id } from '@app/app.declarations';
import GetReviewDto from './dto/get-review.dto';
import ListReviewsDto, { ListReviewsParams } from './dto/list-reviews.dto';
import PostReviewDto from './dto/post-review.dto';
import GetReviewExistenceDto, {
  GetReviewExistenceParams,
} from './dto/get-review-existence.dto';
import AddReviewCase from '../use-cases/add-review.case';
import GetReviewByIdCase from '../use-cases/get-review-by-id.case';
import CheckReviewExistenceCase from '../use-cases/check-review-existence.case';
import FindReviewsCase from '../use-cases/find-reviews.case';
import { AdminEntity } from '@features/admins/entities';

@Injectable()
export default class ReviewsService {
  constructor(
    private readonly getReviewByIdCase: GetReviewByIdCase,
    private readonly findReviewsCase: FindReviewsCase,
    private readonly checkReviewExistenceCase: CheckReviewExistenceCase,
    private readonly addReviewCase: AddReviewCase,
  ) {}

  public async getReviewById(id: Id): Promise<GetReviewDto> {
    return await this.getReviewByIdCase.apply(id);
  }

  public async findReviews(
    params: ListReviewsParams,
    executor?: AdminEntity | UserEntity,
  ): Promise<ListReviewsDto> {
    return await this.findReviewsCase.apply({ ...params, executor });
  }

  public async getReviewExistence(
    params: GetReviewExistenceParams,
    executor: UserEntity,
  ): Promise<GetReviewExistenceDto> {
    return await this.getReviewExistence.apply({ ...params, executor });
  }

  public async addReview(
    dto: PostReviewDto,
    executor: UserEntity,
  ): Promise<GetReviewDto> {
    return await this.addReviewCase.apply({ ...dto, reviewer: executor });
  }
}
