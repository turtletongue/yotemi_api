import { IsDate, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

import { StringToDate } from '@common/decorators';

export default class PostInterviewTimeCheckDto {
  /**
   * Date and time when to start the interview.
   * @example '2022-01-17T00:00:00.000Z'
   */
  @IsDate()
  @StringToDate()
  @IsNotEmpty()
  public startAt: Date;

  /**
   * Date and time when to finish the interview.
   * @example '2022-01-17T00:30:00.000Z'
   */
  @IsDate()
  @StringToDate()
  @IsNotEmpty()
  public endAt: Date;
}
