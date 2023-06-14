import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';

import { PrismaService } from '@common/prisma';
import { PaginationResult, PaginationService } from '@common/pagination';
import InterviewContractService from '@common/ton/interview-contract.service';
import { Id } from '@app/app.declarations';
import BuildInterviewDto from './entities/dto/build-interview.dto';
import { InterviewEntity, InterviewFactory, PlainInterview } from './entities';
import { InterviewNotFoundException } from './exceptions';

const includeUserOptions = {
  include: {
    topics: {
      include: {
        labels: {
          select: {
            id: true,
            value: true,
            language: true,
          },
        },
      },
    },
  },
};

@Injectable()
export default class InterviewsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pagination: PaginationService,
    private readonly interviewFactory: InterviewFactory,
    private readonly interviewContractService: InterviewContractService,
  ) {}

  public async findById(id: Id): Promise<InterviewEntity> {
    const interview = await this.prisma.interview
      .findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          participant: includeUserOptions,
        },
      })
      .catch(() => {
        throw new InterviewNotFoundException();
      });

    return await this.interviewFactory.build({
      ...interview,
      price: interview.price.toNumber(),
    });
  }

  public async findByAddress(address: string): Promise<InterviewEntity> {
    const interview = await this.prisma.interview
      .findUniqueOrThrow({
        where: {
          address,
        },
        include: {
          participant: includeUserOptions,
        },
      })
      .catch(() => {
        throw new InterviewNotFoundException();
      });

    return await this.interviewFactory.build({
      ...interview,
      price: interview.price.toNumber(),
    });
  }

  public async isPaid(id: Id): Promise<boolean> {
    const interview = await this.findById(id);

    const { status } = await this.interviewContractService.getInfo(
      interview.address,
    );

    return status === 'paid';
  }

  public async isFinished(id: Id): Promise<boolean> {
    const interview = await this.findById(id);

    const { status } = await this.interviewContractService.getInfo(
      interview.address,
    );

    return status === 'finished';
  }

  public async isCanceled(id: Id): Promise<boolean> {
    const interview = await this.findById(id);

    const { status } = await this.interviewContractService.getInfo(
      interview.address,
    );

    return status === 'canceled';
  }

  public async isParticipated(
    creatorId: Id,
    participantId: Id,
  ): Promise<boolean> {
    const interview = await this.prisma.interview.findFirst({
      where: {
        creatorId,
        participantId,
      },
    });

    return !!interview;
  }

  public async findPaginated(
    page: number,
    limit: number,
    options?: Prisma.InterviewFindManyArgs,
  ): Promise<PaginationResult<InterviewEntity>> {
    const paginated = await this.pagination.paginate<
      BuildInterviewDto & { price: Decimal }
    >(this.prisma.interview, page, limit, {
      ...options,
      include: {
        participant: includeUserOptions,
        creator: includeUserOptions,
      },
    });

    return {
      ...paginated,
      items: await this.interviewFactory.buildMany(
        paginated.items.map((interview) => ({
          ...interview,
          price: interview.price.toNumber(),
        })),
      ),
    };
  }

  public async findAll(
    options?: Prisma.InterviewFindManyArgs,
  ): Promise<InterviewEntity[]> {
    const interviews = await this.prisma.interview.findMany({
      ...options,
      include: {
        participant: includeUserOptions,
        creator: includeUserOptions,
      },
    });

    return await this.interviewFactory.buildMany(
      interviews.map((interview) => ({
        ...interview,
        price: interview.price.toNumber(),
      })),
    );
  }

  public async hasTimeConflict(
    startAt: Date,
    endAt: Date,
    creatorId: Id,
  ): Promise<boolean> {
    const interview = await this.prisma.interview.findFirst({
      where: {
        creatorId,
        isDeployed: true,
        OR: [
          {
            startAt,
            endAt,
          },
          {
            startAt: {
              lt: startAt,
            },
            endAt: {
              gt: startAt,
            },
          },
          {
            startAt: {
              lt: endAt,
            },
            endAt: {
              gt: endAt,
            },
          },
        ],
      },
    });

    return !!interview;
  }

  public async create(interview: PlainInterview): Promise<InterviewEntity> {
    const result = await this.prisma.interview.create({
      data: {
        id: interview.id,
        address: interview.address,
        price: interview.price,
        startAt: interview.startAt,
        endAt: interview.endAt,
        creatorId: interview.creatorId,
        createdAt: interview.createdAt,
        updatedAt: interview.updatedAt,
      },
    });

    return await this.interviewFactory.build({
      ...result,
      price: result.price.toNumber(),
    });
  }

  public async update(
    interview: Partial<PlainInterview> & Pick<PlainInterview, 'id'>,
  ): Promise<InterviewEntity> {
    const existingInterview = await this.findById(interview.id);

    const { participant, creator, ...data } = interview;

    const result = await this.prisma.interview.update({
      where: {
        id: existingInterview.id,
      },
      data: {
        ...data,
        ...(creator && { creatorId: creator.id }),
        ...(participant && { participantId: participant.id }),
      },
      include: {
        participant: includeUserOptions,
      },
    });

    return await this.interviewFactory.build({
      ...result,
      price: result.price.toNumber(),
    });
  }

  public async delete(id: Id): Promise<InterviewEntity> {
    const existingInterview = await this.findById(id);

    const result = await this.prisma.interview.delete({
      where: {
        id: existingInterview.id,
      },
      include: {
        participant: includeUserOptions,
      },
    });

    return await this.interviewFactory.build({
      ...result,
      price: result.price.toNumber(),
    });
  }
}
