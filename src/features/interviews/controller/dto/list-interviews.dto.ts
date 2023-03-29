import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import { Id } from '@app/app.declarations';
import GetInterviewDto from './get-interview.dto';

export class ListInterviewsParams {
  /**
   * Filter by creator of the interview.
   * @example '69a0526f-6f84-4072-9519-e566b549a9d6'
   */
  @IsString()
  @IsNotEmpty()
  public creatorId: Id;

  /**
   * Lowest boundary of interview's start date.
   * @example '2022-06-03T00:00:00.000Z'
   */
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsNotEmpty()
  public from: Date;

  /**
   * Highest boundary of interview's start date.
   * @example '2022-06-04T00:00:00.000Z'
   */
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsNotEmpty()
  public to: Date;
}

export default class ListInterviewsDto {
  /**
   * List of interviews.
   */
  public items: GetInterviewDto[];
}
