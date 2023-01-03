import { Id } from '@app/app.declarations';
import { UserEntity } from '../../entities';

export default class DeleteUserDto {
  public id: Id;
  public executor: UserEntity;
}
