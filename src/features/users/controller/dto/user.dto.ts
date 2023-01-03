import { IsNotEmpty, IsString } from 'class-validator';

import { IsTonHexAddress } from '@common/validators';

export default class UserDto {
  /**
   * Account address in {@link https://ton.org TON}. (hex format)
   * @example '0:910ccf61e24dd425d39e3cfbb25f8d260a0038bf181ee43739be3051f1d8db10'
   */
  @IsTonHexAddress()
  @IsNotEmpty()
  public accountAddress: string;

  /**
   * Full name of user to display in profile.
   * @example 'Tom Land'
   */
  @IsString()
  @IsNotEmpty()
  public fullName: string;
}
