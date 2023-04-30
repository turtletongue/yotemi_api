import { UserEntity } from '@features/users/entities';
import { Id } from '@app/app.declarations';

export default class MarkInterviewAsDeployedDto {
  public id: Id;
  public executor: UserEntity;
}
