import { Id } from '@app/app.declarations';
import { UserEntity } from '../../entities';

export default class UpdateUserDto {
  public id: Id;
  public fullName?: string;
  public biography?: string;
  public topics?: Id[];
  public executor: UserEntity;
}
