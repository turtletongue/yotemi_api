import { PlainUser } from '@features/users/entities';
import { Id } from '@app/app.declarations';

export default interface PlainReview {
  id: Id;
  points: number;
  comment: string;
  userId: Id;
  reviewer: PlainUser;
  isModerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}
