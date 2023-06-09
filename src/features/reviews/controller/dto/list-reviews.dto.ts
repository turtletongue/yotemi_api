import { IsBoolean, IsIn, IsOptional, IsUUID } from 'class-validator';

import { PaginatedDto, PaginationParams } from '@common/pagination';
import { StringToBoolean } from '@common/decorators';
import { Id } from '@app/app.declarations';
import GetReviewDto from './get-review.dto';

export class ListReviewsParams extends PaginationParams {
  /**
   * Search by user.
   * @example '0312248b-65e7-48ed-8bc1-b44a69547d3e'
   */
  @IsUUID()
  @IsOptional()
  public userId?: Id;

  /**
   * Filter by moderation status.
   * Only for admins.
   * @example true
   */
  @IsBoolean()
  @StringToBoolean()
  @IsOptional()
  public isModerated?: boolean;

  /**
   * Reviews sorting direction.
   * @example 'asc'
   */
  @IsIn(['asc', 'desc'])
  @IsOptional()
  public sortDirection: 'asc' | 'desc' = 'desc';
}

export default class ListReviewsDto extends PaginatedDto(GetReviewDto) {}
