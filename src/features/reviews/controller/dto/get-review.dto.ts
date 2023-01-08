import GetUserDto from '@features/users/controller/dto/get-user.dto';
import { Id } from '@app/app.declarations';
import ReviewDto from './review.dto';

export default class GetReviewDto extends ReviewDto {
  /**
   * Unique identifier of review.
   * @example '477f174f-cabd-4a82-b97a-4b76a38e3319'
   */
  public id: Id;

  /**
   * User who made the review.
   */
  public reviewer: GetUserDto;

  /**
   * Date and time of review creation.
   * @example '2022-07-27T00:00:00.000Z'
   */
  public createdAt: Date;

  /**
   * Date and time of last review update.
   * @example '2022-07-27T00:00:00.000Z'
   */
  public updatedAt: Date;
}
