import { UserEntity } from '@features/users/entities';
import { Id } from '@app/app.declarations';

export default class TakeCreatorPeerIdDto {
  id: Id;
  executor: UserEntity;
}
