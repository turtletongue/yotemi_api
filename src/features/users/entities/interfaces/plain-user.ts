import { Id } from '@app/app.declarations';
import { PlainTopic } from '@features/topics/entities';

export default interface PlainUser {
  id: Id;
  accountAddress: string;
  authId: Id;
  fullName: string;
  biography: string;
  isVerified: boolean;
  topics: PlainTopic[];
  followersCount: number;
  createdAt: Date;
  updatedAt: Date;
}
