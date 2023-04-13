import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AccessGuard, RoleGuard } from '@features/authentication/guards';
import PeersService from './peers.service';
import PeersGateway from '../peers.gateway';

@ApiTags('peers')
@UseGuards(AccessGuard, RoleGuard('user'))
@Controller('peers')
export default class PeersController {
  constructor(
    private readonly peers: PeersService,
    private readonly peersGateway: PeersGateway,
  ) {}

  @Post(':otherUserId')
  public async generate(
    @Param('otherUserId') otherUserId: string,
  ): Promise<{ peerId: string; otherPeerId: string }> {
    const peerId = this.peers.getId();
    const otherPeerId = this.peers.getId();

    this.peersGateway.sendPeerId(otherUserId, 'own', otherPeerId);
    this.peersGateway.sendPeerId(otherUserId, 'other', peerId);

    return { peerId, otherPeerId };
  }
}
