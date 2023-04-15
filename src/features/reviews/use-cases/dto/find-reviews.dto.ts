import { PaginationParams } from '@common/pagination';
import { UserEntity } from '@features/users/entities';
import { AdminEntity } from '@features/admins/entities';
import { Id } from '@app/app.declarations';

export default class FindReviewsDto extends PaginationParams {
  public userId: Id;
  public sortDirection: 'asc' | 'desc';
  public executor?: AdminEntity | UserEntity;
}
