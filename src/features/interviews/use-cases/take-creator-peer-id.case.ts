import { ForbiddenException, Injectable } from '@nestjs/common';

import TakeCreatorPeerIdDto from './dto/take-creator-peer-id.dto';
import InterviewsRepository from '../interviews.repository';
import { InterviewFactory } from '../entities';

@Injectable()
export default class TakeCreatorPeerIdCase {
  constructor(
    private readonly interviewsRepository: InterviewsRepository,
    private readonly interviewFactory: InterviewFactory,
  ) {}

  public async apply({ id, executor }: TakeCreatorPeerIdDto): Promise<string> {
    const interview = await this.interviewsRepository.findById(id);

    if (executor.id !== interview.creatorId) {
      throw new ForbiddenException();
    }

    const peerId = interview.creatorPeerId;
    interview.isCreatorPeerFresh = false;

    await this.interviewsRepository.update(
      await this.interviewFactory.build({
        ...interview,
        ...(!interview.isParticipantPeerFresh && {
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
