import { Id } from '@app/app.declarations';
import AdminDto from './admin.dto';
import { OmitType } from '@nestjs/swagger';

export default class GetAdminDto extends OmitType(AdminDto, ['password']) {
  /**
   * Unique identifier of admin.
   * @example '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000'
   */
  public id: Id;

  /**
   * Date and time of admin creation.
   * @example '2022-05-03T00:00:00.000Z'
   */
  public createdAt: Date;

  /**
   * Date and time of last admin update.
   * @example '2022-05-03T00:00:00.000Z'
   */
  public updatedAt: Date;
}
