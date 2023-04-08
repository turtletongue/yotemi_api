import {
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

import { PaginatedDto, PaginationParams } from '@common/pagination';
import { StringToBoolean } from '@common/decorators';
import { IsTonHexAddress } from '@common/validators';
import { Id } from '@app/app.declarations';
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

  /**
   * Filter by topics.
   * @example 'd49a40db-38be-4a5e-94ac-2370cd133f07,5612c1bd-7fce-472a-ab2d-4e395f7e9ae1'
   */
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => value.split(',').filter((id) => !!id))
  @IsOptional()
  public topicIds?: Id[];

  /**
   * Search by username or biography.
   * @example 'Django'
   */
  @IsString()
  @IsOptional()
  public search?: string;

  /**
   * Show only users with full biography and topics or not.
   * @example false
   */
  @IsBoolean()
  @StringToBoolean()
  @IsOptional()
  public isOnlyFull = true;

  /**
   * Order users by rating or activity.
   * @example 'rating'
   */
  @IsIn(['rating', 'activity'])
  @IsString()
  @IsOptional()
  public orderBy?: 'rating' | 'activity';
}

export default class ListUsersDto extends PaginatedDto(GetUserDto) {}
