import { Injectable } from '@nestjs/common';
import { InterviewStatus } from '@prisma/client';

import { Id } from '@app/app.declarations';
import FindInterviewsDto from './dto/find-interviews.dto';
import InterviewsRepository from '../interviews.repository';
import { PlainInterview } from '../entities';

interface FindOptions {
  where: {
    creatorId: Id;
    date: {
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
    const findOptions: FindOptions = {
      where: {
        creatorId: dto.creatorId,
        date: {
          gte: dto.from,
          lte: dto.to,
        },
      },
    };

    if (dto.status) {
      findOptions.where.status = dto.status;
    }

    const interviews = await this.interviewsRepository.findAll(findOptions);

    return interviews.map((interview) => {
      const plain = interview.getPlain();

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
    });
  }
}
