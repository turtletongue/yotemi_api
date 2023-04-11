import { Injectable } from '@nestjs/common';

import { BaseGateway } from '@common/gateways';
import { Id } from '@app/app.declarations';
import { PlainInterviewMessage } from './entities';

@Injectable()
export default class InterviewMessagesGateway {
  constructor(private readonly baseGateway: BaseGateway) {}

  public sendInterviewMessage(
    userId: Id,
    message: PlainInterviewMessage,
  ): void {
    this.baseGateway.server
      .to(`user-${userId}`)
      .emit('interview-message.created', message);
  }
}
