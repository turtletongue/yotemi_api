import { ApiHideProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

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
  @IsOptional()
  public biography?: string;
}
