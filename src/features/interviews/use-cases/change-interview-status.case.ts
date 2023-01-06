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

    if (existingProperties.creatorId !== dto.executor.id) {
      throw new UnauthorizedException();
    }

    if (dto.status === 'started' && existingProperties.status === 'canceled') {
      throw new InvalidInterviewStatusChangeException(
        'Interview is already canceled',
      );
    }

    if (dto.status === 'started' && existingProperties.participant === null) {
      throw new InvalidInterviewStatusChangeException('Interview is not paid');
    }

    if (!existingProperties.isStartTimeCome) {
      throw new InvalidInterviewStatusChangeException(
        `It is not time for the interview yet. You can start the interview when there are ${existingProperties.remainingMinutesToStart} minutes left`,
      );
    }

    const interview = await this.interviewFactory.build({
      ...existingProperties.plain,
      ...dto,
    });

    const { plain } = await this.interviewsRepository.update(interview.plain);

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
