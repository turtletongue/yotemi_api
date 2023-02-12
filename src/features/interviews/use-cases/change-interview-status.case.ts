import { Injectable, UnauthorizedException } from '@nestjs/common';
import { NotificationType } from '@prisma/client';

import AddNotificationCase from '@features/notifications/use-cases/add-notification.case';
import ChangeInterviewStatus from './dto/change-interview-status';
import InterviewsRepository from '../interviews.repository';
import { PlainInterview } from '../entities';
import { InvalidInterviewStatusChangeException } from '../exceptions';

@Injectable()
export default class ChangeInterviewStatusCase {
  constructor(
    private readonly interviewsRepository: InterviewsRepository,
    private readonly addNotificationCase: AddNotificationCase,
  ) {}

  public async apply(dto: ChangeInterviewStatus): Promise<PlainInterview> {
    const interview = await this.interviewsRepository.findById(dto.id);

    if (interview.creatorId !== dto.executor.id) {
      throw new UnauthorizedException();
    }

    if (dto.status === 'started' && interview.status === 'canceled') {
      throw new InvalidInterviewStatusChangeException(
        'Interview is already canceled',
      );
    }

    if (dto.status === 'started' && interview.participant === null) {
      throw new InvalidInterviewStatusChangeException('Interview is not paid');
    }

    if (!interview.isStartTimeCome) {
      throw new InvalidInterviewStatusChangeException(
        `It is not time for the interview yet. You can start the interview when there are ${interview.remainingMinutesToStart} minutes left`,
      );
    }

    interview.status = dto.status;

    const { plain } = await this.interviewsRepository.update(interview.plain);

    if (
      !!dto.status &&
      dto.status !== interview.status &&
      !!interview.participant
    ) {
      await this.addNotificationCase.apply({
        type:
          dto.status === 'started'
            ? NotificationType.interviewStarted
            : NotificationType.interviewCanceled,
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
        userId: interview.participant.id,
      });
    }

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
