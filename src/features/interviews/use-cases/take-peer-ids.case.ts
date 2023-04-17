import { ForbiddenException, Injectable } from '@nestjs/common';

import TakePeerIdsDto from './dto/take-peer-ids.dto';
import InterviewsRepository from '../interviews.repository';
import { InterviewFactory } from '../entities';

@Injectable()
export default class TakePeerIdsCase {
  constructor(
    private readonly interviewsRepository: InterviewsRepository,
    private readonly interviewFactory: InterviewFactory,
  ) {}

  public async apply({
    id,
    executor,
  }: TakePeerIdsDto): Promise<{ peerId: string; otherPeerId: string }> {
    const interview = await this.interviewsRepository.findById(id);

    if (
      executor.id !== interview.creatorId &&
      executor.id !== interview.participant?.id
    ) {
      throw new ForbiddenException();
    }

    const peerId =
      executor.id === interview.creatorId
        ? interview.creatorPeerId
        : interview.participantPeerId;
    const otherPeerId =
      interview.creatorPeerId === peerId
        ? interview.participantPeerId
        : interview.creatorPeerId;

    if (executor.id === interview.creatorId) {
      interview.isCreatorPeerFresh = false;
    } else {
      interview.isParticipantPeerFresh = false;
    }

    await this.interviewsRepository.update(
      await this.interviewFactory.build({
        ...interview,
        ...(!interview.isParticipantPeerFresh &&
          !interview.isCreatorPeerFresh && {
            creatorPeerId: undefined,
            isCreatorPeerFresh: true,
            participantPeerId: undefined,
            isParticipantPeerFresh: true,
          }),
      }),
    );

    return { peerId, otherPeerId };
  }
}
