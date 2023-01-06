import { UserEntity } from '@features/users/entities';
import { Id } from '@app/app.declarations';

export default class FindInterviewMessagesDto {
  public interviewId: Id;
  public executor: UserEntity;
}
