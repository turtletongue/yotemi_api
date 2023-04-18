import { Injectable } from '@nestjs/common';

import { BaseGateway } from '@common/gateways';
import { Id } from '@app/app.declarations';

@Injectable()
export default class PeersGateway {
  constructor(private readonly baseGateway: BaseGateway) {}

  public sendPeerId(
    userId: Id,
    interviewId: Id,
    type: 'own' | 'other',
    peerId: string,
  ): void {
    this.baseGateway.server
      .to(`user-${userId}`)
      .emit('peer.created', { type, interviewId, peerId });
  }

  public sendAudioMuted(userId: Id, interviewId: Id): void {
    this.baseGateway.server
      .to(`user-${userId}`)
      .emit('peer.audio-muted', interviewId);
  }

  public sendAudioUnmuted(userId: Id, interviewId: Id): void {
    this.baseGateway.server
      .to(`user-${userId}`)
      .emit('peer.audio-unmuted', interviewId);
  }

  public sendVideoMuted(userId: Id, interviewId: Id): void {
    this.baseGateway.server
      .to(`user-${userId}`)
      .emit('peer.video-muted', interviewId);
  }

  public sendVideoUnmuted(userId: Id, interviewId: Id): void {
    this.baseGateway.server
      .to(`user-${userId}`)
      .emit('peer.video-unmuted', interviewId);
  }

  public sendDisconnected(userId: Id, interviewId: Id): void {
    this.baseGateway.server
      .to(`user-${userId}`)
      .emit('peer.disconnected', interviewId);
  }
}
