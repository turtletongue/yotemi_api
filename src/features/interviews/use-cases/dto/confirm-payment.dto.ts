import { UserEntity } from '@features/users/entities';
import { Id } from '@app/app.declarations';

export default class ConfirmPaymentDto {
  public id: Id;
  public comment: string;
  public executor: UserEntity;
}
