import { ApiHideProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

import { Id } from '@app/app.declarations';
import UserDto from './user.dto';

export default class PatchUserDto extends PartialType(
  OmitType(UserDto, ['accountAddress']),
) {
  @ApiHideProperty()
  public id: Id;

  /**
   * Description of user skills, qualities, etc.
   * Will be displayed in user profile.
   * @example 'I have solid knowledge of design patterns and 6 years of development experience with Python and Django.'
   */
  @IsString()
  @MaxLength(350)
  @IsOptional()
  public biography?: string;

  /**
   * Array of topics' identifiers to connect with user.
   * @example ['39b6694a-8b50-44bf-907f-46d371801370']
   */
  @IsArray()
  @IsOptional()
  public topics: Id[] = [];
}
