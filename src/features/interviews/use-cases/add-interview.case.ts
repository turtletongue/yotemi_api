import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';

import AddNotificationCase from '@features/notifications/use-cases/add-notification.case';
import AddInterviewDto from './dto/add-interview.dto';
import InterviewsRepository from '../interviews.repository';
import { InterviewFactory, PlainInterview } from '../entities';
import {
  InterviewHasTimeConflictException,
  InterviewInPastException,
  InvalidInterviewEndDateException,
} from '../exceptions';

@Injectable()
export default class AddInterviewCase {
  constructor(
    private readonly interviewsRepository: InterviewsRepository,
    private readonly interviewFactory: InterviewFactory,
    private readonly addNotificationCase: AddNotificationCase,
  ) {}

  public async apply(dto: AddInterviewDto): Promise<PlainInterview> {
    if (dto.startAt < new Date()) {
      throw new InterviewInPastException();
    }

    if (dto.endAt <= dto.startAt) {
      throw new InvalidInterviewEndDateException();
    }

    const creatorId = dto.executor.id;

    const hasConflict = await this.interviewsRepository.hasTimeConflict(
      dto.startAt,
      dto.endAt,
      creatorId,
    );

    if (hasConflict) {
      throw new InterviewHasTimeConflictException();
    }

    const interview = await this.interviewFactory.build({
      ...dto,
      creatorId,
    });

    const { plain } = await this.interviewsRepository.create(interview.plain);

    await this.addNotificationCase.apply({
      type: NotificationType.interviewScheduled,
      content: {
        interview: {
          id: plain.id,
          startAt: plain.startAt,
        },
        creator: {
          id: dto.executor.id,
          fullName: dto.executor.fullName,
          accountAddress: dto.executor.accountAddress,
        },
      },
      userId: creatorId,
    });

    return {
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
    };
  }
}
