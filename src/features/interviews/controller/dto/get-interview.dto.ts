import { InterviewStatus } from '@prisma/client';

import { Id } from '@app/app.declarations';
import InterviewDto from './interview.dto';
import GetUserDto from '@features/users/controller/dto/get-user.dto';

export default class GetInterviewDto extends InterviewDto {
  /**
   * Unique identifier of the interview.
   * @example '1121bdc9-2115-4d4c-8457-ee9fefc2b093'
   */
  public id: Id;

  /**
   * Status of the interview.
   * @example 'published'
   */
  public status: InterviewStatus;

  /**
   * Identifier of interview's creator.
   * @example '3c7e64d7-65f3-4df4-ab1e-c78e76fa85d1'
   */
  public creatorId: Id;

  /**
   * User who bought the interview (if exists).
   */
  public participant: GetUserDto | null;

  /**
   * Comment written by participant who bought the interview.
   * @example 'Love to talk with you!'
   */
  public payerComment: string | null;

  /**
   * Date and time of interview creation.
   * @example '2022-05-03T00:00:00.000Z'
   */
  public createdAt: Date;

  /**
   * Date and time of last interview update.
   * @example '2022-05-03T00:00:00.000Z'
   */
  public updatedAt: Date;
}
