import { PlainUser } from '@features/users/entities';
import { Id } from '@app/app.declarations';

export default interface PlainInterview {
  id: Id;
  address: string;
  price: number;
  startAt: Date;
  endAt: Date;
  creator: PlainUser | null;
  creatorId: Id;
  participant: PlainUser | null;
  payerComment: string | null;
  createdAt: Date;
  updatedAt: Date;
}
