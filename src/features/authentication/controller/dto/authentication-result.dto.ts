import GetAdminDto from '@features/admins/controller/dto/get-admin.dto';
import GetUserDto from '@features/users/controller/dto/get-user.dto';

export default class AuthenticationResultDto {
  /**
   * Access token to use in Bearer auth.
   * @example 'eyJhbGciOiJIU...'
   */
  public accessToken: string;

  /**
   * Admin information if it is admin authentication.
   */
  public admin?: GetAdminDto;

  /**
   * User information if it is user authentication.
   */
  public user?: GetUserDto;
}
