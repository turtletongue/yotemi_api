import { UserEntity } from '@features/users/entities';
import { Id } from '@app/app.declarations';

export default class ChangeCoverDto {
  public id: Id;
  public path: string | null;
  public executor: UserEntity;
}
