import { ApiHideProperty, OmitType, PartialType } from '@nestjs/swagger';

import { Id } from '@app/app.declarations';
import AdminDto from './admin.dto';

export default class PatchAdminDto extends PartialType(
  OmitType(AdminDto, ['password']),
) {
  @ApiHideProperty()
  public id: Id;
}
