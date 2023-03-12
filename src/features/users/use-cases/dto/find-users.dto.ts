import { PaginationParams } from '@common/pagination';
import { UserEntity } from '@features/users/entities';
import { AdminEntity } from '@features/admins/entities';

export default class FindUsersDto extends PaginationParams {
  public hideSelf?: boolean;
  public executor?: UserEntity | AdminEntity;
}
