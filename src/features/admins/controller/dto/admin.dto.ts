import { IsNotEmpty, IsString, MinLength } from 'class-validator';

import { PASSWORD_MIN_LENGTH } from '@app/app.constants';

export default class AdminDto {
  /**
   * Username for authentication.
   * @example 'admin'
   */
  @IsString()
  @IsNotEmpty()
  public username: string;

  /**
   * Password for authentication.
   * @example 'super_strong_password'
   */
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH)
  public password: string;
}
