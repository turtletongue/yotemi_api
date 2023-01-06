import { IsNotEmpty, IsString } from 'class-validator';

export default class InterviewMessageDto {
  /**
   * Message text.
   * @example 'Hello!'
   */
  @IsString()
  @IsNotEmpty()
  public content: string;

  /**
   * Identifier of the interview.
   * @example '0dd537b4-4b9e-43d8-b098-2a3ffcce5e1f'
   */
  @IsString()
  @IsNotEmpty()
  public interviewId: string;
}
