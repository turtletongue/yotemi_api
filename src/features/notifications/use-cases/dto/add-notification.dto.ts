import { NotificationType } from '@prisma/client';

import { Id } from '@app/app.declarations';

export default class AddNotificationDto {
  public type: NotificationType;
  public content: Record<string, unknown>;
  public userId: Id;
}
