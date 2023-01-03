import { IsInt, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export default class PaginationParams {
  /**
   * Page number.
   * @example 1
   */
  @IsInt()
  @Min(1)
  @Transform(({ value }) => +value)
  @IsOptional()
  public page?: number;

  /**
   * Current page size.
   * @example 10
   */
  @IsInt()
  @Min(1)
  @Transform(({ value }) => +value)
  @IsOptional()
  public pageSize?: number;
}
