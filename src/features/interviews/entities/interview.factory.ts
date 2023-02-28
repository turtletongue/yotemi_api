import { Injectable } from '@nestjs/common';

import { IdentifiersService } from '@common/identifiers';
import InterviewContractService from '@common/ton/interview-contract.service';
import { UserFactory } from '@features/users/entities';
import BuildInterviewDto from './dto/build-interview.dto';
import InterviewEntity from './interview.entity';

@Injectable()
export default class InterviewFactory {
  constructor(
    private readonly identifiers: IdentifiersService,
    private readonly userFactory: UserFactory,
    private readonly interviewContractService: InterviewContractService,
  ) {}

  public async build({
    id = this.identifiers.generate(),
    address,
    price,
    startAt,
    endAt,
    creatorId,
    participant = null,
    payerComment = null,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: BuildInterviewDto): Promise<InterviewEntity> {
    const participantEntity = participant
      ? await this.userFactory.build(participant)
      : null;

    const isDeployed = await this.interviewContractService.isDeployed(address);
    const info = await this.interviewContractService.getInfo(address);

    return new InterviewEntity(
      id,
      address,
      price,
      startAt,
      endAt,
      info?.status || 'published',
      creatorId,
      participantEntity,
      payerComment,
      isDeployed,
      createdAt,
      updatedAt,
    );
  }
}
