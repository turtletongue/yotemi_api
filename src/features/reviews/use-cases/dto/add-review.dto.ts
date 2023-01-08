import { UserEntity } from '@features/users/entities';
import { Id } from '@app/app.declarations';

export default class AddReviewDto {
  public points: number;
  public comment: string;
  public userId: Id;
  public reviewer: UserEntity;
}
