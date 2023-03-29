import { Id } from '@app/app.declarations';
import { TopicEntity } from '@features/topics/entities';
import PlainUser from './interfaces/plain-user';

export default class UserEntity {
  public readonly kind = 'user';

  constructor(
    public id: Id,
    public username: string,
    public accountAddress: string,
    public authId: Id,
    public firstName: string,
    public lastName: string,
    public biography: string,
    public avatarPath: string | null,
    public coverPath: string | null,
    public isVerified: boolean,
    public topics: TopicEntity[],
    public followersCount: number,
    public averagePoints: number,
    public reviewsCount: number,
    public isBlocked: boolean,
    public isFollowing: boolean | null,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  public get hasTooManyTopics(): boolean {
    return this.topics.length > 8;
  }

  public block(): UserEntity {
    this.isBlocked = true;

    return this;
  }

  public unblock(): UserEntity {
    this.isBlocked = false;

    return this;
  }

  public get plain(): PlainUser {
    return {
      id: this.id,
      username: this.username,
      accountAddress: this.accountAddress,
      authId: this.authId,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.fullName,
      biography: this.biography,
      avatarPath: this.avatarPath,
      coverPath: this.coverPath,
      isVerified: this.isVerified,
      topics: this.topics.map((topic) => topic.plain),
      followersCount: this.followersCount,
      averagePoints: this.averagePoints,
      reviewsCount: this.reviewsCount,
      isBlocked: this.isBlocked,
      isFollowing: this.isFollowing,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
