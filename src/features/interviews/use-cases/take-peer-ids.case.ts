import { ForbiddenException, Injectable } from '@nestjs/common';

import TakePeerIdsDto from './dto/take-peer-ids.dto';
import InterviewsRepository from '../interviews.repository';

@Injectable()
export default class TakePeerIdsCase {
  constructor(private readonly interviewsRepository: InterviewsRepository) {}

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

    return { peerId, otherPeerId };
  }
}
