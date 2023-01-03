import { Id } from '@app/app.declarations';

export default interface PlainAdmin {
  id: Id;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
