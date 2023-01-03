import { Id } from '@app/app.declarations';
import PlainAdmin from './interfaces/plain-admin';

export default class AdminEntity {
  public readonly kind = 'admin';

  constructor(
    private readonly id: Id,
    private readonly username: string,
    private readonly passwordHash: string,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
    public readonly isPasswordMatch: (password: string) => Promise<boolean>,
  ) {}

  public getId(): Id {
    return this.id;
  }

  public getUsername(): string {
    return this.username;
  }

  public getHashedPassword(): string {
    return this.passwordHash;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public getPlain(): PlainAdmin {
    return {
      id: this.id,
      username: this.username,
      password: this.passwordHash,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
