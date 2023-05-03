import { Injectable } from '@nestjs/common';

import { PubsubService } from '@common/pubsub';
import { Id } from '@app/app.declarations';
import { PlainNotification } from './entities';

@Injectable()
export default class NotificationsProducer {
  constructor(private readonly pubsub: PubsubService) {}

  public async sendNotification(
    userId: Id,
    notification: PlainNotification,
  ): Promise<void> {
    await this.pubsub
      .getClient()
      .publish('send-notification', JSON.stringify({ userId, notification }));
  }

  public async updateNotification(
    userId: Id,
    notification: PlainNotification,
  ): Promise<void> {
    await this.pubsub
      .getClient()
      .publish('update-notification', JSON.stringify({ userId, notification }));
  }
}
