import { NotificationType } from '@prisma/client';

import { Id } from '@app/app.declarations';
import PlainNotification from './interfaces/plain-notification';

export default class NotificationEntity {
  constructor(
    private _id: Id,
    private _type: NotificationType,
    private _content: Record<string, unknown> | null,
    private _isSeen: boolean,
    private _userId: Id,
    private _createdAt: Date,
    private _updatedAt: Date,
  ) {}

  public get id(): Id {
    return this._id;
  }

  public get type(): NotificationType {
    return this._type;
  }

  public get content(): Record<string, unknown> | null {
    return this._content;
  }

  public get isSeen(): boolean {
    return this._isSeen;
  }

  public get userId(): Id {
    return this._userId;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public get plain(): PlainNotification {
    return {
      id: this.id,
      type: this.type,
      content: this.content,
      isSeen: this.isSeen,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
