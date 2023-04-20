import { UserEntity } from '@features/users/entities';
import { AdminEntity } from '@features/admins/entities';
import { Id } from '@app/app.declarations';

export default class FindInterviewsDto {
  public creatorId: Id;
  public from: Date;
  public to: Date;
  public executor?: AdminEntity | UserEntity;
}
