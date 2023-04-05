import { IsDate, IsNotEmpty, IsNumber, Min, NotEquals } from 'class-validator';

import { StringToDate } from '@common/decorators';
import { IsTonHexAddress } from '@common/validators';

export default class InterviewDto {
  /**
   * Interview contract address.
   * @example 'EQBYd5Ud1NyDH-iutpPtLCvrMBh1TQWVmhjvd-zbziEuaz9g'
   */
  @IsTonHexAddress()
  public address: string;

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
