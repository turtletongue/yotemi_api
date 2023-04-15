import { IsIn, IsOptional, IsUUID } from 'class-validator';

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

  /**
   * Reviews sorting direction.
   * @example 'asc'
   */
  @IsIn(['asc', 'desc'])
  @IsOptional()
  public sortDirection: 'asc' | 'desc' = 'desc';
}

export default class ListReviewsDto extends PaginatedDto(GetReviewDto) {}
