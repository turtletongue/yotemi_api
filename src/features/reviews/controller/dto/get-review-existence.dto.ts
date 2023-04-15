import { IsNotEmpty, IsString } from 'class-validator';

import { Id } from '@app/app.declarations';

export class GetReviewExistenceParams {
  @IsString()
  @IsNotEmpty()
  public userId: Id;
}

export default class GetReviewExistenceDto {
  /**
   * Is review exist or not.
   */
  public isExist: boolean;
}
