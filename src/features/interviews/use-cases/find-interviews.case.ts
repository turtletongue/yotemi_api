import { Injectable } from '@nestjs/common';
import { InterviewStatus } from '@prisma/client';

import { Id } from '@app/app.declarations';
import { MS_IN_DAY } from '@app/app.constants';
import FindInterviewsDto from './dto/find-interviews.dto';
import InterviewsRepository from '../interviews.repository';
import { PlainInterview } from '../entities';
import { InterviewsTimeFilterTooWideException } from '../exceptions';
import { MAX_DAYS_DIFF_FOR_FIND_INTERVIEWS_FILTER } from '../interviews.constants';

interface FindOptions {
  where: {
    creatorId: Id;
    startAt: {
      gte: Date;
      lte: Date;
    };
    status?: InterviewStatus;
  };
}

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

    const findOptions: FindOptions = {
      where: {
        creatorId: dto.creatorId,
        startAt: {
          gte: dto.from,
          lte: dto.to,
        },
      },
    };

    if (dto.status) {
      findOptions.where.status = dto.status;
    }

    const interviews = await this.interviewsRepository.findAll(findOptions);

    return interviews.map(({ plain }) => ({
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
    }));
  }
}
