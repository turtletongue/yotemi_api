import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@common/prisma';
import { Id } from '@app/app.declarations';
import {
  InterviewMessageEntity,
  InterviewMessageFactory,
  PlainInterviewMessage,
} from './entities';
import { InterviewMessageNotFoundException } from './exceptions';

@Injectable()
export default class InterviewMessagesRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly interviewMessageFactory: InterviewMessageFactory,
  ) {}

  public async findById(id: Id): Promise<InterviewMessageEntity> {
    const interviewMessage = await this.prisma.interviewMessage
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .catch(() => {
        throw new InterviewMessageNotFoundException();
      });

    return await this.interviewMessageFactory.build(interviewMessage);
  }

  public async findAll(
    options?: Prisma.InterviewMessageFindManyArgs,
  ): Promise<InterviewMessageEntity[]> {
    const interviewMessages = await this.prisma.interviewMessage.findMany(
      options,
    );

    return await this.interviewMessageFactory.buildMany(interviewMessages);
  }

  public async create(
    interviewMessage: PlainInterviewMessage,
  ): Promise<InterviewMessageEntity> {
    const result = await this.prisma.interviewMessage.create({
      data: interviewMessage,
    });

    return await this.interviewMessageFactory.build(result);
  }
}
