import { Injectable } from '@nestjs/common';

import { Id } from '@app/app.declarations';
import InterviewsRepository from '../interviews.repository';
import { PlainInterview } from '../entities';

@Injectable()
export default class GetInterviewByIdCase {
  constructor(private readonly interviewsRepository: InterviewsRepository) {}

  public async apply(id: Id): Promise<PlainInterview> {
    const { plain } = await this.interviewsRepository.findById(id);

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
