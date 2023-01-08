import { IsUUID } from 'class-validator';

import { PaginatedDto, PaginationParams } from '@common/pagination';
import { Id } from '@app/app.declarations';
import GetReviewDto from './get-review.dto';

export class ListReviewsParams extends PaginationParams {
  /**
   * Search by user.
   * @example '0312248b-65e7-48ed-8bc1-b44a69547d3e'
   */
  @IsUUID()
  public userId: Id;
}

export default class ListReviewsDto extends PaginatedDto(GetReviewDto) {}
