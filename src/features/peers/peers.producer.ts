import { Injectable } from '@nestjs/common';

import { PubsubService } from '@common/pubsub';
import { Id } from '@app/app.declarations';

@Injectable()
export default class PeersProducer {
  constructor(private readonly pubsub: PubsubService) {}

  public async sendAudioMuted(userId: Id, interviewId: Id): Promise<void> {
    await this.pubsub
      .getClient()
      .publish('peer-mute-audio', JSON.stringify({ userId, interviewId }));
  }

  public async sendAudioUnmuted(userId: Id, interviewId: Id): Promise<void> {
    await this.pubsub
      .getClient()
      .publish('peer-unmute-audio', JSON.stringify({ userId, interviewId }));
  }

  public async sendVideoMuted(userId: Id, interviewId: Id): Promise<void> {
    await this.pubsub
      .getClient()
      .publish('peer-mute-video', JSON.stringify({ userId, interviewId }));
  }

  public async sendVideoUnmuted(userId: Id, interviewId: Id): Promise<void> {
    await this.pubsub
      .getClient()
      .publish('peer-unmute-video', JSON.stringify({ userId, interviewId }));
  }

  public async sendDisconnected(userId: Id, interviewId: Id): Promise<void> {
    await this.pubsub
      .getClient()
      .publish('peer-disconnect', JSON.stringify({ userId, interviewId }));
  }
}
