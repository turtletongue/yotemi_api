import { Id } from '@app/app.declarations';

export default class AddUserDto {
  public accountAddress: string;
  public fullName: string;
  public biography?: string;
  public topics?: Id[];
}
