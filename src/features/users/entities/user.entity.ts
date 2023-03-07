import { Id } from '@app/app.declarations';
import { TopicEntity } from '@features/topics/entities';
import PlainUser from './interfaces/plain-user';

export default class UserEntity {
  public readonly kind = 'user';

  constructor(
    private _id: Id,
    private _accountAddress: string,
    private _authId: Id,
    private _firstName: string,
    private _lastName: string,
    private _biography: string,
    private _avatarPath: string | null,
    private _coverPath: string | null,
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

  public get firstName(): string {
    return this.firstName;
  }

  public get lastName(): string {
    return this.lastName;
  }

  public get fullName(): string {
    return `${this._firstName} ${this.lastName}`;
  }

  public get biography(): string {
    return this._biography;
  }

  public get avatarPath(): string | null {
    return this._avatarPath;
  }

  public set avatarPath(value: string | null) {
    this._avatarPath = value;
  }

  public get coverPath(): string | null {
    return this._coverPath;
  }

  public set coverPath(value: string | null) {
    this._coverPath = value;
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
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.fullName,
      biography: this.biography,
      avatarPath: this.avatarPath,
      coverPath: this.coverPath,
      isVerified: this.isVerified,
      topics: this.topics.map((topic) => topic.plain),
      followersCount: this.followersCount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
