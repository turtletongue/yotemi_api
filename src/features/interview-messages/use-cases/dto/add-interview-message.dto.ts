import { UserEntity } from '@features/users/entities';
import { Id } from '@app/app.declarations';

export default class AddInterviewMessageDto {
  public content: string;
  public interviewId: Id;
  public executor: UserEntity;
}
