import { Id } from '@app/app.declarations';
import { PlainTopic } from '@features/topics/entities';

export default interface PlainUser {
  id: Id;
  accountAddress: string;
  authId: Id;
  firstName: string;
  lastName: string;
  fullName: string;
  biography: string;
  avatarPath: string | null;
  coverPath: string | null;
  isVerified: boolean;
  topics: PlainTopic[];
  followersCount: number;
  createdAt: Date;
  updatedAt: Date;
}
