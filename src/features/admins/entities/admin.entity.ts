import { Id } from '@app/app.declarations';
import PlainAdmin from './interfaces/plain-admin';

export default class AdminEntity {
  public readonly kind = 'admin';

  constructor(
    public id: Id,
    public username: string,
    public hashedPassword: string,
    public createdAt: Date,
    public updatedAt: Date,
    public readonly isPasswordMatch: (password: string) => Promise<boolean>,
  ) {}

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
