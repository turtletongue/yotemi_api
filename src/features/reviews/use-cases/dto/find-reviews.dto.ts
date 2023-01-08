import { PaginationParams } from '@common/pagination';
import { Id } from '@app/app.declarations';

export default class FindReviewsDto extends PaginationParams {
  public userId: Id;
}
