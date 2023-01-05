import { Injectable } from '@nestjs/common';

import AddInterviewDto from './dto/add-interview.dto';
import InterviewsRepository from '../interviews.repository';
import { InterviewFactory, PlainInterview } from '../entities';
import { InterviewInPastException } from '../exceptions';

@Injectable()
export default class AddInterviewCase {
  constructor(
    private readonly interviewsRepository: InterviewsRepository,
    private readonly interviewFactory: InterviewFactory,
  ) {}

  public async apply(dto: AddInterviewDto): Promise<PlainInterview> {
    if (dto.date < new Date()) {
      throw new InterviewInPastException();
    }

    const interview = await this.interviewFactory.build({
      ...dto,
      creatorId: dto.executor.getId(),
    });

    const createdInterview = await this.interviewsRepository.create(
      interview.getPlain(),
    );
    const plain = createdInterview.getPlain();

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
