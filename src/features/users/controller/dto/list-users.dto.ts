import { IsBoolean, IsOptional } from 'class-validator';

import { PaginatedDto, PaginationParams } from '@common/pagination';
import { StringToBoolean } from '@common/decorators';
import { IsTonHexAddress } from '@common/validators';
import GetUserDto from './get-user.dto';

export class ListUsersParams extends PaginationParams {
  /**
   * Filter by account address.
   * @example '0:910ccf61e24dd425d39e3cfbb25f8d260a0038bf181ee43739be3051f1d8db10'
   */
  @IsTonHexAddress()
  @IsOptional()
  public accountAddress?: string;

  /**
   * Hide user with provided account address instead of showing.
   * @example false
   */
  @IsBoolean()
  @StringToBoolean()
  @IsOptional()
  public hideSelf?: boolean;
}

export default class ListUsersDto extends PaginatedDto(GetUserDto) {}
