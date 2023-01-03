import { Id } from '@app/app.declarations';
import UserDto from './user.dto';

export default class GetUserDto extends UserDto {
  /**
   * Unique identifier of user.
   * @example '75442486-0878-440c-9db1-a7006c25a39f'
   */
  public id: Id;

  /**
   * Unique identifier for authentication with crypto-wallet.
   * @example '82850d07-67b7-46ab-aa84-369fe145cbf4'
   */
  public authId: Id;

  /**
   * Description of user skills, qualities, etc.
   * Will be displayed in user profile.
   * @example 'I have solid knowledge of design patterns and 6 years of development experience with Python and Django.'
   */
  public biography: string;

  /**
   * If user's account is verified we can match the account address with a real person.
   * @example false
   */
  public isVerified: boolean;

  /**
   * Date and time of user creation.
   * @example '2022-11-08T00:00:00.000Z'
   */
  public createdAt: Date;

  /**
   * Date and time of last user update.
   * @example '2022-11-08T00:00:00.000Z'
   */
  public updatedAt: Date;
}
