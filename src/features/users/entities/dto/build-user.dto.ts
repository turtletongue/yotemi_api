import { Id } from '@app/app.declarations';

export default class BuildUserDto {
  public id?: Id;
  public accountAddress: string;
  public authId?: Id;
  public fullName: string;
  public biography?: string;
  public isVerified?: boolean;
  public createdAt?: Date;
  public updatedAt?: Date;
}
