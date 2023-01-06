import { Id } from '@app/app.declarations';
import PlainAdmin from './interfaces/plain-admin';

export default class AdminEntity {
  public readonly kind = 'admin';

  constructor(
    private _id: Id,
    private _username: string,
    private _passwordHash: string,
    private _createdAt: Date,
    private _updatedAt: Date,
    public readonly isPasswordMatch: (password: string) => Promise<boolean>,
  ) {}

  public get id(): Id {
    return this._id;
  }

  public get username(): string {
    return this._username;
  }

  public get hashedPassword(): string {
    return this._passwordHash;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public get plain(): PlainAdmin {
    return {
      id: this.id,
      username: this.username,
      password: this.hashedPassword,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
