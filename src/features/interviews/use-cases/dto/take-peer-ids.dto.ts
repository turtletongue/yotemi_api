import { UserEntity } from '@features/users/entities';
import { Id } from '@app/app.declarations';

export default class TakePeerIdsDto {
  id: Id;
  executor: UserEntity;
}
