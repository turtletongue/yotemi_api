import { Injectable } from '@nestjs/common';

import { BaseGateway } from '@common/gateways';
import { Id } from '@app/app.declarations';

@Injectable()
export default class PeersGateway {
  constructor(private readonly baseGateway: BaseGateway) {}

  public sendPeerId(userId: Id, peerId: string): void {
    this.baseGateway.server.to(`user-${userId}`).emit('peer.created', peerId);
  }
}
