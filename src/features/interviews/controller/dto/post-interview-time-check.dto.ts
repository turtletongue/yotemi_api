import { IsDate, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export default class PostInterviewTimeCheckDto {
  /**
   * Date and time when to start the interview.
   * @example '2022-01-17T00:00:00.000Z'
   */
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsNotEmpty()
  public startAt: Date;

  /**
   * Date and time when to finish the interview.
   * @example '2022-01-17T00:30:00.000Z'
   */
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsNotEmpty()
  public endAt: Date;
}
