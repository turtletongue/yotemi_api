import { NotificationType } from '@prisma/client';

import { Id } from '@app/app.declarations';
import PlainNotification from './interfaces/plain-notification';

export default class NotificationEntity {
  constructor(
    public id: Id,
    public type: NotificationType,
    public content: Record<string, unknown> | null,
    public isSeen: boolean,
    public userId: Id,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

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
