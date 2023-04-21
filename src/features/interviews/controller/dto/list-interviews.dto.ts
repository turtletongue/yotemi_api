import { PartialType } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { PaginatedDto, PaginationParams } from '@common/pagination';

import { StringToDate } from '@common/decorators';
import { Id } from '@app/app.declarations';
import GetInterviewDto from './get-interview.dto';

export class ListInterviewsParams extends PaginationParams {
  /**
   * Filter by creator of the interview.
   * @example '69a0526f-6f84-4072-9519-e566b549a9d6'
   */
  @IsString()
  @IsNotEmpty()
  @ValidateIf((dto) => dto.page === undefined && dto.pageSize === undefined)
  public creatorId?: Id;

  /**
   * Lowest boundary of interview's start date.
   * @example '2022-06-03T00:00:00.000Z'
   */
  @IsDate()
  @StringToDate()
  @IsNotEmpty()
  @ValidateIf((dto) => dto.page === undefined && dto.pageSize === undefined)
  public from?: Date;

  /**
   * Highest boundary of interview's start date.
   * @example '2022-06-04T00:00:00.000Z'
   */
  @IsDate()
  @StringToDate()
  @IsNotEmpty()
  @ValidateIf((dto) => dto.page === undefined && dto.pageSize === undefined)
  public to?: Date;
}

export default class ListInterviewsDto extends PartialType(
  PaginatedDto(GetInterviewDto),
) {}
