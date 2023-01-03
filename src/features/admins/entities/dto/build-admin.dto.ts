import { Id } from '@app/app.declarations';

export default class BuildAdminDto {
  public id?: Id;
  public username: string;
  public password?: string;
  public passwordHash?: string;
  public createdAt?: Date;
  public updatedAt?: Date;
}
