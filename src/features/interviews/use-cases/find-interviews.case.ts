import { Injectable } from '@nestjs/common';

import { MS_IN_DAY } from '@app/app.constants';
import FindInterviewsDto from './dto/find-interviews.dto';
import InterviewsRepository from '../interviews.repository';
import { PlainInterview } from '../entities';
import { InterviewsTimeFilterTooWideException } from '../exceptions';
import { MAX_DAYS_DIFF_FOR_FIND_INTERVIEWS_FILTER } from '../interviews.constants';

@Injectable()
export default class FindInterviewsCase {
  constructor(private readonly interviewsRepository: InterviewsRepository) {}

  public async apply(dto: FindInterviewsDto): Promise<PlainInterview[]> {
    if (
      dto.to.getTime() - dto.from.getTime() >
      MAX_DAYS_DIFF_FOR_FIND_INTERVIEWS_FILTER * MS_IN_DAY
    ) {
      throw new InterviewsTimeFilterTooWideException();
    }

    const interviews = await this.interviewsRepository.findAll({
      where: {
        creatorId: dto.creatorId,
        startAt: {
          gte: dto.from,
          lte: dto.to,
        },
      },
    });

    return interviews.map(({ plain }) => ({
      id: plain.id,
      address: plain.address,
      price: plain.price,
      startAt: plain.startAt,
      endAt: plain.endAt,
      creatorId: plain.creatorId,
      participant: plain.participant,
      payerComment: plain.payerComment,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    }));
  }
}
