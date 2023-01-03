import { IsNotEmpty, IsString } from 'class-validator';

export default class AuthenticateAdminDto {
  /**
   * Administrator's username.
   * @example 'admin'
   */
  @IsString()
  @IsNotEmpty()
  public username: string;

  /**
   * Administrator's password.
   * @example 'some_strong_password'
   */
  @IsString()
  @IsNotEmpty()
  public password: string;
}
