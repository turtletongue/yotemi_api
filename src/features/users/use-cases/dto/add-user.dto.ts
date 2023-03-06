import { Id } from '@app/app.declarations';

export default class AddUserDto {
  public accountAddress: string;
  public firstName: string;
  public lastName: string;
  public biography?: string;
  public topics?: Id[];
}
