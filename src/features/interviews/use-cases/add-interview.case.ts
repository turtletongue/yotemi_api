import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';

import InterviewContractService from '@common/ton/interview-contract.service';
import AddNotificationCase from '@features/notifications/use-cases/add-notification.case';
import AddInterviewDto from './dto/add-interview.dto';
import CheckInterviewTimeConflictCase from './check-interview-time-conflict.case';
import InterviewsRepository from '../interviews.repository';
import { InterviewFactory, PlainInterview } from '../entities';
import {
  AddressNotUniqueException,
  ContractMalformedException,
} from '../exceptions';

@Injectable()
export default class AddInterviewCase {
  constructor(
    private readonly interviewsRepository: InterviewsRepository,
    private readonly interviewFactory: InterviewFactory,
    private readonly interviewContractService: InterviewContractService,
    private readonly addNotificationCase: AddNotificationCase,
    private readonly checkInterviewTimeConflictCase: CheckInterviewTimeConflictCase,
  ) {}

  public async apply(dto: AddInterviewDto): Promise<PlainInterview> {
    const isAddressTaken = await this.interviewsRepository.isAddressTaken(
      dto.address,
    );

    if (isAddressTaken) {
      throw new AddressNotUniqueException();
    }

    await this.checkInterviewTimeConflictCase.apply(dto);

    const interview = await this.interviewFactory.build({
      ...dto,
      creatorId: dto.executor.id,
    });

    const isMalformed = await this.interviewContractService.isCodeMalformed(
      dto.address,
      interview.plain,
      dto.executor.accountAddress,
    );

    if (isMalformed) {
      throw new ContractMalformedException();
    }

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
      userId: dto.executor.id,
    });

    return plain;
  }
}
