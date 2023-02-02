import { NotificationType } from '@prisma/client';

import { Id } from '@app/app.declarations';

export default class BuildNotificationDto {
  public id?: Id;
  public type: NotificationType;
  public content?: Record<string, unknown> | null;
  public isSeen?: boolean;
  public userId: Id;
  public createdAt?: Date;
  public updatedAt?: Date;
}
