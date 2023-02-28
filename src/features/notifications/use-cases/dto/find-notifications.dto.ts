import { PaginationParams } from '@common/pagination';
import { UserEntity } from '@features/users/entities';

export default class FindNotificationsDto extends PaginationParams {
  public executor: UserEntity;
}
