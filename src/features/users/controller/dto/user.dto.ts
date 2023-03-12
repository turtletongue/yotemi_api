import { IsNotEmpty, IsString, MinLength } from 'class-validator';

import { IsTonHexAddress } from '@common/validators';

export default class UserDto {
  /**
   * Username and slug for user profile.
   * @example 'tom'
   */
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  public username: string;

  /**
   * Account address in {@link https://ton.org TON}. (hex format)
   * @example '0:910ccf61e24dd425d39e3cfbb25f8d260a0038bf181ee43739be3051f1d8db10'
   */
  @IsTonHexAddress()
  @IsNotEmpty()
  public accountAddress: string;

  /**
   * First name of user to display in profile.
   * @example 'Tom'
   */
  @IsString()
  @IsNotEmpty()
  public firstName: string;

  /**
   *  Last name of user to display in profile.
   * @example 'Land'
   */
  @IsString()
  @IsNotEmpty()
  public lastName: string;
}
