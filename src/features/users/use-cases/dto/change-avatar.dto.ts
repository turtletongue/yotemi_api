import { UserEntity } from '@features/users/entities';
import { Id } from '@app/app.declarations';

export default class ChangeAvatarDto {
  public id: Id;
  public path: string;
  public executor: UserEntity;
}
