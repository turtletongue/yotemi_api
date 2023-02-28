import { NotificationType } from '@prisma/client';

import { Id } from '@app/app.declarations';

export default interface PlainNotification {
  id: Id;
  type: NotificationType;
  content: Record<string, unknown> | null;
  isSeen: boolean;
  userId: Id;
  createdAt: Date;
  updatedAt: Date;
}
