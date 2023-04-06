import { IsInt, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';

import { Id } from '@app/app.declarations';

export default class ReviewDto {
  /**
   * How much reviewer likes work of the user on a scale from one to five.
   * @example 5
   */
  @IsInt()
  @Min(0)
  @Max(5)
  public points: number;

  /**
   * Reviewer's comment. Can be empty.
   * @example 'You are a nice teacher!'
   */
  @IsString()
  @MaxLength(250)
  public comment: string;

  /**
   * Identifier of the user whose content is reviewed.
   * @example '77e92019-69c9-4fef-a464-df9576670f4a'
   */
  @IsUUID()
  public userId: Id;
}
