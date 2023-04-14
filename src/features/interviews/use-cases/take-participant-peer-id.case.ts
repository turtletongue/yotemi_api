import { ForbiddenException, Injectable } from '@nestjs/common';

import TakeParticipantPeerIdDto from './dto/take-participant-peer-id.dto';
import InterviewsRepository from '../interviews.repository';
import { InterviewFactory } from '../entities';

@Injectable()
export default class TakeParticipantPeerIdCase {
  constructor(
    private readonly interviewsRepository: InterviewsRepository,
    private readonly interviewFactory: InterviewFactory,
  ) {}

  public async apply({
    id,
    executor,
  }: TakeParticipantPeerIdDto): Promise<string> {
    const interview = await this.interviewsRepository.findById(id);

    if (executor.id !== interview.participant?.id) {
      throw new ForbiddenException();
    }

    const peerId = interview.participantPeerId;
    interview.isParticipantPeerFresh = false;

    await this.interviewsRepository.update(
      await this.interviewFactory.build({
        ...interview,
        ...(!interview.isCreatorPeerFresh && {
          creatorPeerId: undefined,
          isCreatorPeerFresh: true,
          participantPeerId: undefined,
          isParticipantPeerFresh: true,
        }),
      }),
    );

    return peerId;
  }
}
