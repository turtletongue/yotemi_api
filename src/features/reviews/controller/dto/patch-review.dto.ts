import { IsString, MaxLength } from 'class-validator';

export default class PatchReviewDto {
  /**
   * Moderated reviewer's comment. Can be empty.
   * @example 'You are a nice teacher!'
   */
  @IsString()
  @MaxLength(250)
  public comment: string;
}
