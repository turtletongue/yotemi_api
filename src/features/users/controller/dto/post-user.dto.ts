import { IsOptional, IsString } from 'class-validator';

import UserDto from './user.dto';

export default class PostUserDto extends UserDto {
  /**
   * Description of user skills, qualities, etc.
   * Will be displayed in user profile.
   * @example 'I have solid knowledge of design patterns and 6 years of development experience with Python and Django.'
   * @default ''
   */
  @IsString()
  @IsOptional()
  public biography?: string;
}
