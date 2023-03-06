import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@common/prisma';
import InterviewContractService from '@common/ton/interview-contract.service';
import { Id } from '@app/app.declarations';
import { InterviewEntity, InterviewFactory, PlainInterview } from './entities';
import { InterviewNotFoundException } from './exceptions';

const includeParticipantOptions = {
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
          participant: includeParticipantOptions,
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

  public async isAddressTaken(address: string): Promise<boolean> {
    const interview = await this.prisma.interview.findFirst({
      where: {
        address,
      },
    });

    return !!interview;
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
    const result = await this.prisma.interview.findFirst({
      where: {
        creatorId,
        participantId,
      },
    });

    if (!result) {
      return false;
    }

    const { status } = await this.interviewContractService.getInfo(
      result.address,
    );

    return status === 'finished';
  }

  public async findAll(
    options?: Prisma.InterviewFindManyArgs,
  ): Promise<InterviewEntity[]> {
    const interviews = await this.prisma.interview.findMany({
      ...options,
      include: {
        participant: includeParticipantOptions,
      },
    });

    return await Promise.all(
      interviews.map(
        async (interview) =>
          await this.interviewFactory.build({
            ...interview,
            price: interview.price.toNumber(),
          }),
      ),
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
        OR: [
          {
            startAt: {
              lte: startAt,
            },
            endAt: {
              gte: startAt,
            },
          },
          {
            startAt: {
              lte: endAt,
            },
            endAt: {
              gte: endAt,
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

    const { participant, ...data } = interview;

    const result = await this.prisma.interview.update({
      where: {
        id: existingInterview.id,
      },
      data: {
        ...data,
        participantId: participant.id,
      },
      include: {
        participant: includeParticipantOptions,
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
        participant: includeParticipantOptions,
      },
    });

    return await this.interviewFactory.build({
      ...result,
      price: result.price.toNumber(),
    });
  }
}
