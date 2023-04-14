import { Injectable } from '@nestjs/common';

import { IdentifiersService } from '@common/identifiers';
import InterviewsRepository from '@features/interviews/interviews.repository';
import { UserEntity } from '@features/users/entities';
import { Id } from '@app/app.declarations';

type GeneratePeerResponse = {
  peerId: string;
  otherPeerId: string;
};

@Injectable()
export default class PeersService {
  constructor(
    private readonly identifiers: IdentifiersService,
    private readonly interviewsRepository: InterviewsRepository,
  ) {}

  public async getIds(): Promise<GeneratePeerResponse> {
    return {
      peerId: this.identifiers.generate(),
      otherPeerId: this.identifiers.generate(),
    };
  }

  public async getOtherUserId(
    interviewId: Id,
    executor: UserEntity,
  ): Promise<Id> {
    const interview = await this.interviewsRepository.findById(interviewId);

    return interview.creatorId === executor.id
      ? interview.participant?.id
      : interview.creatorId;
  }

  public async hasPeerAccess(
    interviewId: Id,
    executor: UserEntity,
  ): Promise<boolean> {
    const interview = await this.interviewsRepository.findById(interviewId);
    const isPaid = await this.interviewsRepository.isPaid(interviewId);
    const isParticipant =
      interview.creatorId === executor.id ||
      interview.participant?.id === executor.id;

    return isParticipant && isPaid;
  }
}
