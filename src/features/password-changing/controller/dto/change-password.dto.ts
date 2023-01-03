import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

import { Id } from '@app/app.declarations';
import { PASSWORD_MIN_LENGTH } from '@app/app.constants';

export default class ChangePasswordDto {
  /**
   * Identifier of admin who needs to change the password.
   * @example '829e4233-b699-4237-9a79-6b3a43274446'
   */
  @IsUUID()
  @IsNotEmpty()
  public id: Id;

  /**
   * New password for admin.
   * @example 'new_strong_password'
   */
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH)
  public password: string;
}
