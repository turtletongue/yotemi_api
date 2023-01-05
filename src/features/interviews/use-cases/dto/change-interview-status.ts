import { UserEntity } from '@features/users/entities';
import { Id } from '@app/app.declarations';

export default class ChangeInterviewStatus {
  public id: Id;
  public status: 'started' | 'canceled';
  public executor: UserEntity;
}
