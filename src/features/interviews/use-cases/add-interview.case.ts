import { Injectable } from '@nestjs/common';

import AddInterviewDto from './dto/add-interview.dto';
import InterviewsRepository from '../interviews.repository';
import { InterviewFactory, PlainInterview } from '../entities';
import {
  InterviewHasTimeConflictException,
  InterviewInPastException,
  InvalidInterviewEndDateException,
} from '../exceptions';

@Injectable()
export default class AddInterviewCase {
  constructor(
    private readonly interviewsRepository: InterviewsRepository,
    private readonly interviewFactory: InterviewFactory,
  ) {}

  public async apply(dto: AddInterviewDto): Promise<PlainInterview> {
    if (dto.startAt < new Date()) {
      throw new InterviewInPastException();
    }

    if (dto.endAt <= dto.startAt) {
      throw new InvalidInterviewEndDateException();
    }

    const creatorId = dto.executor.id;

    const hasConflict = await this.interviewsRepository.hasTimeConflict(
      dto.startAt,
      dto.endAt,
      creatorId,
    );

    if (hasConflict) {
      throw new InterviewHasTimeConflictException();
    }

    const interview = await this.interviewFactory.build({
      ...dto,
      creatorId,
    });

    const { plain } = await this.interviewsRepository.create(interview.plain);

    return {
      id: plain.id,
      price: plain.price,
      startAt: plain.startAt,
      endAt: plain.endAt,
      status: plain.status,
      creatorId: plain.creatorId,
      participant: plain.participant,
      payerComment: plain.payerComment,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    };
  }
}
