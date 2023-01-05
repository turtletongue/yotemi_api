import { IsDate, IsNotEmpty, IsNumber, Min, NotEquals } from 'class-validator';
import { Transform } from 'class-transformer';

export default class InterviewDto {
  /**
   * Price of the interview in {@link https://ton.org TON}.
   * @example 15
   */
  @IsNumber()
  @NotEquals(0)
  @Min(0)
  @IsNotEmpty()
  public price: number;

  /**
   * Date and time when to start the interview.
   * @example '2022-01-17T00:00:00.000Z'
   */
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsNotEmpty()
  public date: Date;
}
