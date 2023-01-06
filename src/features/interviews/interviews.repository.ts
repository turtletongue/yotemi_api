import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@common/prisma';
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

  public async create(interview: PlainInterview): Promise<InterviewEntity> {
    const result = await this.prisma.interview.create({
      data: {
        id: interview.id,
        price: interview.price,
        date: interview.date,
        status: interview.status,
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
