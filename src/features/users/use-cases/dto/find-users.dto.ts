import { PaginationParams } from '@common/pagination';
import { UserEntity } from '@features/users/entities';

export default class FindUsersDto extends PaginationParams {
  public hideSelf?: boolean;
  public executor?: UserEntity;
}
