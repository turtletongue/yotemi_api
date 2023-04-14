import { Injectable } from '@nestjs/common';

import InterviewsRepository from '@features/interviews/interviews.repository';
import { UserEntity } from '@features/users/entities';
import { Id } from '@app/app.declarations';

@Injectable()
export default class PeersService {
  constructor(private readonly interviewsRepository: InterviewsRepository) {}

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
