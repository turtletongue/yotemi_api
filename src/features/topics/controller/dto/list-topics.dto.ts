import { IsBoolean, IsOptional, IsString } from 'class-validator';

import { PaginatedDto, PaginationParams } from '@common/pagination';
import { StringToBoolean } from '@common/decorators';
import GetTopicDto from './get-topic.dto';

export class ListTopicsParams extends PaginationParams {
  /**
   * Search by label.
   * @example 'Computer Science'
   */
  @IsString()
  @IsOptional()
  public label?: string;

  @IsBoolean()
  @StringToBoolean()
  @IsOptional()
  public isModerated?: boolean;
}

export default class ListTopicsDto extends PaginatedDto(GetTopicDto) {}
