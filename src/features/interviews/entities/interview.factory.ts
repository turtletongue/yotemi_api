import { Injectable } from '@nestjs/common';
import { InterviewStatus } from '@prisma/client';

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
    price,
    startAt,
    endAt,
    status = InterviewStatus.published,
    creatorId,
    participant = null,
    payerComment = null,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: BuildInterviewDto): Promise<InterviewEntity> {
    const participantEntity = participant
      ? await this.userFactory.build(participant)
      : null;

    return new InterviewEntity(
      id,
      price,
      startAt,
      endAt,
      status,
      creatorId,
      participantEntity,
      payerComment,
      createdAt,
      updatedAt,
    );
  }
}
