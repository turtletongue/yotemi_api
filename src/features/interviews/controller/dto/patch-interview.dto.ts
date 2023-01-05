import { ApiHideProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

import { Id } from '@app/app.declarations';

export default class PatchInterviewDto {
  @ApiHideProperty()
  public id: Id;

  /**
   * New status of the interview.
   * @example 'started'
   */
  @IsIn(['started', 'canceled'])
  public status: 'started' | 'canceled';
}
