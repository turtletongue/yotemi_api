import { Injectable, UnauthorizedException } from '@nestjs/common';

import ChangeInterviewStatus from './dto/change-interview-status';
import InterviewsRepository from '../interviews.repository';
import { InterviewFactory, PlainInterview } from '../entities';
import { InvalidInterviewStatusChangeException } from '../exceptions';

@Injectable()
export default class ChangeInterviewStatusCase {
  constructor(
    private readonly interviewsRepository: InterviewsRepository,
    private readonly interviewFactory: InterviewFactory,
  ) {}

  public async apply(dto: ChangeInterviewStatus): Promise<PlainInterview> {
    const existingProperties = await this.interviewsRepository.findById(dto.id);

    if (existingProperties.getCreatorId() !== dto.executor.getId()) {
      throw new UnauthorizedException();
    }

    if (
      dto.status === 'started' &&
      existingProperties.getStatus() === 'canceled'
    ) {
      throw new InvalidInterviewStatusChangeException(
        'Interview is already canceled',
      );
    }

    if (
      dto.status === 'started' &&
      existingProperties.getParticipant() === null
    ) {
      throw new InvalidInterviewStatusChangeException('Interview is not paid');
    }

    const interview = await this.interviewFactory.build({
      ...existingProperties.getPlain(),
      ...dto,
    });

    const canceledInterview = await this.interviewsRepository.update(
      interview.getPlain(),
    );
    const plain = canceledInterview.getPlain();

    return {
      id: plain.id,
      price: plain.price,
      date: plain.date,
      status: plain.status,
      creatorId: plain.creatorId,
      participant: plain.participant,
      payerComment: plain.payerComment,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    };
  }
}
