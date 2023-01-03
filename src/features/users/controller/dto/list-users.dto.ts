import { IsOptional } from 'class-validator';

import { PaginatedDto, PaginationParams } from '@common/pagination';
import { IsTonHexAddress } from '@common/validators';
import GetUserDto from './get-user.dto';

export class ListUsersParams extends PaginationParams {
  @IsTonHexAddress()
  @IsOptional()
  public accountAddress?: string;
}

export default class ListUsersDto extends PaginatedDto(GetUserDto) {}
