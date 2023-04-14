import { Injectable } from '@nestjs/common';

import { IdentifiersService } from '@common/identifiers';
import { UserFactory } from '@features/users/entities';
import BuildInterviewDto from './dto/build-interview.dto';
import InterviewEntity from './interview.entity';

@Injectable()
export default class InterviewFactory {
  constructor(
    private readonly identifiers: IdentifiersService,
    private readonly userFactory: UserFactory,
  ) {}

  public async build({
    id = this.identifiers.generate(),
    address,
    price,
    startAt,
    endAt,
    creatorId,
    creatorPeerId = this.identifiers.generate(),
    isCreatorPeerFresh = true,
    participant = null,
    participantPeerId = this.identifiers.generate(),
    isParticipantPeerFresh = true,
    payerComment = null,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: BuildInterviewDto): Promise<InterviewEntity> {
    const participantEntity = participant
      ? await this.userFactory.build(participant)
      : null;

    return new InterviewEntity(
      id,
      address,
      price,
      startAt,
      endAt,
      creatorId,
      creatorPeerId,
      isCreatorPeerFresh,
      participantEntity,
      participantPeerId,
      isParticipantPeerFresh,
      payerComment,
      createdAt,
      updatedAt,
    );
  }
}
