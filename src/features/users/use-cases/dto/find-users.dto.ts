import { PaginationParams } from '@common/pagination';
import { UserEntity } from '@features/users/entities';
import { AdminEntity } from '@features/admins/entities';
import { Id } from '@app/app.declarations';

export default class FindUsersDto extends PaginationParams {
  public hideSelf?: boolean;
  public topicIds?: Id[];
  public search?: string;
  public isOnlyFull?: boolean;
  public orderBy?: 'rating' | 'activity';
  public executor?: AdminEntity | UserEntity;
}
