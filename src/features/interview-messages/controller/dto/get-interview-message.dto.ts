import { Id } from '@app/app.declarations';
import InterviewMessageDto from './interview-message.dto';

export default class GetInterviewMessageDto extends InterviewMessageDto {
  /**
   * Unique identifier of the message.
   * @example 'a7c0b53f-272b-447b-a85b-afd779998068'
   */
  public id: Id;

  /**
   * Identifier of the message's author.
   * @example '4d66ecc7-2684-4111-9b7e-fdfd7973b8d4'
   */
  public authorId: Id;

  /**
   * Date and time of message creation.
   * @example '2022-12-12T00:00:00.000Z'
   */
  public createdAt: Date;

  /**
   * Date and time of last message update.
   * @example '2022-12-12T00:00:00.000Z'
   */
  public updatedAt: Date;
}
