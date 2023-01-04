import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { PaginatedDto, PaginationParams } from '@common/pagination';
import GetTopicDto from './get-topic.dto';

export class ListTopicsParams extends PaginationParams {
  /**
   * Search by label.
   * @example 'Computer Science'
   */
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public label?: string;
}

export default class ListTopicsDto extends PaginatedDto(GetTopicDto) {}
