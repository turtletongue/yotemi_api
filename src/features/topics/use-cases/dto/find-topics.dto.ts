import { PaginationParams } from '@common/pagination';
import { UserEntity } from '@features/users/entities';
import { AdminEntity } from '@features/admins/entities';

export default class FindTopicsDto extends PaginationParams {
  public label?: string;
  public isModerated?: boolean;
  public executor?: AdminEntity | UserEntity;
}
