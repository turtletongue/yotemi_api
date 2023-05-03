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
import PeersProducer from '../peers.producer';
import { GeneratePeerResponse } from '../peers.types';

@ApiTags('peers')
@UseGuards(AccessGuard, RoleGuard('user'))
@Controller('peers')
export default class PeersController {
  constructor(
    private readonly peers: PeersService,
    private readonly peersProducer: PeersProducer,
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
      await this.peersProducer.sendVideoMuted(otherUserId, interviewId);
    } else {
      await this.peersProducer.sendAudioMuted(otherUserId, interviewId);
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
      await this.peersProducer.sendVideoUnmuted(otherUserId, interviewId);
    } else {
      await this.peersProducer.sendAudioUnmuted(otherUserId, interviewId);
    }
  }

  @Post(':interviewId/disconnect')
  public async disconnect(
    @Param('interviewId') interviewId: string,
    @User() executor: UserEntity,
  ): Promise<void> {
    const hasPeerAccess = await this.peers.hasPeerAccess(interviewId, executor);

    if (!hasPeerAccess) {
      throw new ForbiddenException();
    }

    const otherUserId = await this.peers.getOtherUserId(interviewId, executor);

    await this.peersProducer.sendDisconnected(otherUserId, interviewId);
  }
}
