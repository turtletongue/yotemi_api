import { IsInt, IsOptional, Min } from 'class-validator';

import { StringToNumber } from '@common/decorators';

export default class PaginationParams {
  /**
   * Page number.
   * @example 1
   */
  @IsInt()
  @Min(1)
  @StringToNumber()
  @IsOptional()
  public page?: number;

  /**
   * Current page size.
   * @example 10
   */
  @IsInt()
  @Min(1)
  @StringToNumber()
  @IsOptional()
  public pageSize?: number;
}
