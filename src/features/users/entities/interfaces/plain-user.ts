import { Id } from '@app/app.declarations';
import { PlainTopic } from '@features/topics/entities';

export default interface PlainUser {
  id: Id;
  username: string;
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
  followersCount: string;
  averagePoints: number;
  reviewsCount: string;
  isBlocked: boolean;
  isFollowing: boolean | null;
  createdAt: Date;
  updatedAt: Date;
}
