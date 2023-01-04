import { Id } from '@app/app.declarations';
import { TopicEntity } from '@features/topics/entities';
import PlainUser from './interfaces/plain-user';

export default class UserEntity {
  public readonly kind = 'user';

  constructor(
    private readonly id: Id,
    private readonly accountAddress: string,
    private readonly authId: Id,
    private readonly fullName: string,
    private readonly biography: string,
    private readonly isVerified: boolean,
    private readonly topics: TopicEntity[],
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {}

  public getId(): Id {
    return this.id;
  }

  public getAccountAddress(): string {
    return this.accountAddress;
  }

  public getAuthId(): string {
    return this.authId;
  }

  public getFullName(): string {
    return this.fullName;
  }

  public getBiography(): string {
    return this.biography;
  }

  public getIsVerified(): boolean {
    return this.isVerified;
  }

  public getTopics(): TopicEntity[] {
    return this.topics;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public getPlain(): PlainUser {
    return {
      id: this.id,
      accountAddress: this.accountAddress,
      authId: this.authId,
      fullName: this.fullName,
      biography: this.biography,
      isVerified: this.isVerified,
      topics: this.topics.map((topic) => topic.getPlain()),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
