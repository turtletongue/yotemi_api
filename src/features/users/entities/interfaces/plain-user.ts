import { Id } from '@app/app.declarations';

export default interface PlainUser {
  id: Id;
  accountAddress: string;
  authId: Id;
  fullName: string;
  biography: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
