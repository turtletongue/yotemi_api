import { Id } from '@app/app.declarations';
import { TopicEntity } from '@features/topics/entities';
import PlainUser from './interfaces/plain-user';

export default class UserEntity {
  public readonly kind = 'user';

  constructor(
    private _id: Id,
    private _accountAddress: string,
    private _authId: Id,
    private _fullName: string,
    private _biography: string,
    private _isVerified: boolean,
    private _topics: TopicEntity[],
    private _followersCount: number,
    private _createdAt: Date,
    private _updatedAt: Date,
  ) {}

  public get id(): Id {
    return this._id;
  }

  public get accountAddress(): string {
    return this._accountAddress;
  }

  public get authId(): string {
    return this._authId;
  }

  public get fullName(): string {
    return this._fullName;
  }

  public get biography(): string {
    return this._biography;
  }

  public get isVerified(): boolean {
    return this._isVerified;
  }

  public get topics(): TopicEntity[] {
    return this._topics;
  }

  public get followersCount(): number {
    return this._followersCount;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public get plain(): PlainUser {
    return {
      id: this.id,
      accountAddress: this.accountAddress,
      authId: this.authId,
      fullName: this.fullName,
      biography: this.biography,
      isVerified: this.isVerified,
      topics: this.topics.map((topic) => topic.plain),
      followersCount: this.followersCount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
