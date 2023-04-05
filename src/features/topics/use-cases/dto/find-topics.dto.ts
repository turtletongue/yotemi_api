import { PaginationParams } from '@common/pagination';
import { UserEntity } from '@features/users/entities';

export default class FindTopicsDto extends PaginationParams {
  public label?: string;
  public isModerated?: boolean;
  public executor?: UserEntity;
}
