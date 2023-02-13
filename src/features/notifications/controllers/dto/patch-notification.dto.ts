import { ApiHideProperty } from '@nestjs/swagger';

import { Id } from '@app/app.declarations';

export default class PatchNotificationDto {
  @ApiHideProperty()
  public id: Id;
}
