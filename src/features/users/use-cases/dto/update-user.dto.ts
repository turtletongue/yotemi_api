import { Id } from '@app/app.declarations';
import { UserEntity } from '../../entities';

export default class UpdateUserDto {
  public id: Id;
  public firstName?: string;
  public lastName?: string;
  public biography?: string;
  public topics?: Id[];
  public executor: UserEntity;
}
