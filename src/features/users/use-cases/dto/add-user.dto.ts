import { Id } from '@app/app.declarations';

export default class AddUserDto {
  public username: string;
  public accountAddress: string;
  public firstName: string;
  public lastName: string;
  public biography?: string;
  public topics?: Id[];
}
