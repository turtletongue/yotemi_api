import {
  Controller,
  ForbiddenException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AccessGuard, RoleGuard } from '@features/authentication/guards';
import { User } from '@features/authentication/decorators';
import { UserEntity } from '@features/users/entities';
import PeersService from './peers.service';
import PeersGateway from '../peers.gateway';
import { GeneratePeerResponse } from '../peers.types';

@ApiTags('peers')
@UseGuards(AccessGuard, RoleGuard('user'))
@Controller('peers')
export default class PeersController {
  constructor(
    private readonly peers: PeersService,
    private readonly peersGateway: PeersGateway,
  ) {}

  @Post(':interviewId')
  public async register(
    @Param('interviewId') interviewId: string,
    @User() executor: UserEntity,
  ): Promise<GeneratePeerResponse> {
    const hasPeerAccess = await this.peers.hasPeerAccess(interviewId, executor);

    if (!hasPeerAccess) {
      throw new ForbiddenException();
    }

    return {
      interviewId,
      otherHasVideo: false,
      otherHasAudio: false,
    };
  }

  @Post(':interviewId/:type/mute')
  public async mute(
    @Param('interviewId') interviewId: string,
    @Param('type') type: string,
    @User() executor: UserEntity,
  ): Promise<void> {
    const hasPeerAccess = await this.peers.hasPeerAccess(interviewId, executor);

    if (!hasPeerAccess || !['video', 'audio'].includes(type)) {
      throw new ForbiddenException();
    }

    const otherUserId = await this.peers.getOtherUserId(interviewId, executor);

    if (type === 'video') {
      this.peersGateway.sendVideoMuted(otherUserId, interviewId);
    } else {
      this.peersGateway.sendAudioMuted(otherUserId, interviewId);
    }
  }

  @Post(':interviewId/:type/unmute')
  public async unmuteAudio(
    @Param('interviewId') interviewId: string,
    @Param('type') type: string,
    @User() executor: UserEntity,
  ): Promise<void> {
    const hasPeerAccess = await this.peers.hasPeerAccess(interviewId, executor);

    if (!hasPeerAccess || !['video', 'audio'].includes(type)) {
      throw new ForbiddenException();
    }

    const otherUserId = await this.peers.getOtherUserId(interviewId, executor);

    if (type === 'video') {
      this.peersGateway.sendVideoUnmuted(otherUserId, interviewId);
    } else {
      this.peersGateway.sendAudioUnmuted(otherUserId, interviewId);
    }
  }
}
