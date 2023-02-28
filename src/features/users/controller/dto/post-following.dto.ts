import { IsString } from 'class-validator';

import { Id } from '@app/app.declarations';

export default class PostFollowingDto {
  /**
   * Identifier of user to follow.
   * @example '11b9163c-7c58-4e02-b857-6b2962da1311'
   */
  @IsString()
  public followingId: Id;
}
