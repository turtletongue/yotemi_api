import { UserEntity } from '@features/users/entities';
import { Id } from '@app/app.declarations';

export default class CheckReviewExistenceDto {
  public userId: Id;
  public executor: UserEntity;
}
