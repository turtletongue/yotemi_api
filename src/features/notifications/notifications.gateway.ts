import { Injectable } from '@nestjs/common';

import { BaseGateway } from '@common/gateways';
import { Id } from '@app/app.declarations';
import { PlainNotification } from './entities';
import { FOLLOWING_NOTIFICATIONS } from './notifications.constants';

@Injectable()
export default class NotificationsGateway {
  constructor(private readonly baseGateway: BaseGateway) {}

  public sendNotification(userId: Id, notification: PlainNotification): void {
    this.baseGateway.server
      .to(`user-${userId}`)
      .emit('notification.created', notification);

    if (FOLLOWING_NOTIFICATIONS.includes(notification.type)) {
      this.baseGateway.server
        .to(`followers-of-${userId}`)
        .emit('notification.created', notification);
    }
  }

  public updateNotification(userId: Id, notification: PlainNotification): void {
    this.baseGateway.server
      .to(`user-${userId}`)
      .emit('notification.updated', notification);

    if (FOLLOWING_NOTIFICATIONS.includes(notification.type)) {
      this.baseGateway.server
        .to(`followers-of-${userId}`)
        .emit('notification.updated', notification);
    }
  }
}
