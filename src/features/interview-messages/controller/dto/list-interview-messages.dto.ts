import { IsNotEmpty, IsString } from 'class-validator';

import { Id } from '@app/app.declarations';
import GetInterviewMessageDto from './get-interview-message.dto';

export class ListInterviewMessagesParams {
  /**
   * Search by identifier of the interview.
   * @example '0dd537b4-4b9e-43d8-b098-2a3ffcce5e1f'
   */
  @IsString()
  @IsNotEmpty()
  public interviewId: Id;
}

export default class ListInterviewMessagesDto {
  /**
   * List of interviews.
   */
  public items: GetInterviewMessageDto[];
}
