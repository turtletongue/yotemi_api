import { Injectable } from '@nestjs/common';

import { PubsubService } from '@common/pubsub';
import { Id } from '@app/app.declarations';
import { PlainInterviewMessage } from './entities';

@Injectable()
export default class InterviewMessagesProducer {
  constructor(private readonly pubsub: PubsubService) {}

  public async sendInterviewMessage(
    userId: Id,
    message: PlainInterviewMessage,
  ): Promise<void> {
    await this.pubsub
      .getClient()
      .publish('send-interview-message', JSON.stringify({ userId, message }));
  }
}
