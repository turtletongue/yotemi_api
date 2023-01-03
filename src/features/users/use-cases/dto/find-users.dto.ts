import { PaginationParams } from '@common/pagination';

export default class FindUsersDto extends PaginationParams {
  public accountAddress?: string;
}
