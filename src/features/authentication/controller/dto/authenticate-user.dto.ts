import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { IsTonHexAddress } from '@common/validators';
import SignatureDto from './signature.dto';

export default class AuthenticateUserDto {
  /**
   * TON smart-contract address of user to authenticate.
   * @example '0:910ccf61e24dd425d39e3cfbb25f8d260a0038bf181ee43739be3051f1d8db10'
   */
  @IsTonHexAddress()
  @IsNotEmpty()
  public accountAddress: string;

  /**
   * Signature created from user's authId.
   */
  @ValidateNested()
  @Type(() => SignatureDto)
  @IsNotEmpty()
  public signature: SignatureDto;
}
