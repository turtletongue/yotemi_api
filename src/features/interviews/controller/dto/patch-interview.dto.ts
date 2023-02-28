import { IsString } from 'class-validator';

export default class PatchInterviewDto {
  /**
   * Comment for payment.
   * @example 'Love your lessons!'
   */
  @IsString()
  public comment: string;
}
