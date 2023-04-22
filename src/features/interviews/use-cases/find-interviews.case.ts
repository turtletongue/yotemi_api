import { Injectable } from '@nestjs/common';

import { S3Service } from '@common/s3';
import { PaginationResult } from '@common/pagination';
import { MS_IN_DAY } from '@app/app.constants';
import FindInterviewsDto from './dto/find-interviews.dto';
import InterviewsRepository from '../interviews.repository';
import { InterviewEntity, PlainInterview } from '../entities';
import { InterviewsTimeFilterTooWideException } from '../exceptions';
import { MAX_DAYS_DIFF_FOR_FIND_INTERVIEWS_FILTER } from '../interviews.constants';

@Injectable()
export default class FindInterviewsCase {
  constructor(
    private readonly interviewsRepository: InterviewsRepository,
    private readonly s3: S3Service,
  ) {}

  public async apply(
    dto: FindInterviewsDto,
  ): Promise<PaginationResult<PlainInterview> | PlainInterview[]> {
    if (dto.to && dto.from && !dto.pageSize && !dto.page) {
      const isTimeFilterTooWide =
        dto.to.getTime() - dto.from.getTime() >
        MAX_DAYS_DIFF_FOR_FIND_INTERVIEWS_FILTER * MS_IN_DAY;

      if (isTimeFilterTooWide) {
        throw new InterviewsTimeFilterTooWideException();
      }
    }

    const options = {
      where: {
        creatorId: dto.creatorId,
        participantId: dto.participantId,
        ...((dto.to || dto.from) && {
          startAt: {
            gte: dto.from,
            lte: dto.to,
          },
        }),
        ...(dto.executor &&
          dto.executor.kind === 'user' && {
            OR: [
              { participantId: null },
              { participantId: dto.executor.id },
              { creatorId: dto.executor.id },
            ],
          }),
      },
      orderBy: {
        startAt: 'asc',
      },
    } as const;

    const interviews =
      dto.page || dto.pageSize
        ? await this.interviewsRepository.findPaginated(
            dto.page,
            dto.pageSize,
            options,
          )
        : await this.interviewsRepository.findAll(options);

    if (Array.isArray(interviews)) {
      return interviews.map((interview) => this.interviewToResponse(interview));
    }

    return {
      ...interviews,
      items: interviews.items.map((interview) =>
        this.interviewToResponse(interview),
      ),
    };
  }

  private interviewToResponse({ plain }: InterviewEntity): PlainInterview {
    return {
      ...plain,
      creator: plain.creator && {
        ...plain.creator,
        avatarPath: plain.creator?.avatarPath
          ? this.s3.getReadPath(plain.creator.avatarPath)
          : null,
        coverPath: plain.creator?.coverPath
          ? this.s3.getReadPath(plain.creator.coverPath)
          : null,
      },
      participant: plain.participant && {
        ...plain.participant,
        avatarPath: plain.participant?.avatarPath
          ? this.s3.getReadPath(plain.participant.avatarPath)
          : null,
        coverPath: plain.participant?.coverPath
          ? this.s3.getReadPath(plain.participant.coverPath)
          : null,
      },
    };
  }
}
