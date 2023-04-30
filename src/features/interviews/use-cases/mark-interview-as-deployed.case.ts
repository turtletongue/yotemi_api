import { ForbiddenException, Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';

import InterviewContractService from '@common/ton/interview-contract.service';
import AddNotificationCase from '@features/notifications/use-cases/add-notification.case';
import MarkInterviewAsDeployedDto from './dto/mark-interview-as-deployed.dto';
import InterviewsRepository from '../interviews.repository';
import { InterviewNotDeployedException } from '../exceptions';

@Injectable()
export default class MarkInterviewAsDeployedCase {
  constructor(
    private readonly interviewsRepository: InterviewsRepository,
    private readonly interviewContractService: InterviewContractService,
    private readonly addNotificationCase: AddNotificationCase,
  ) {}

  public async apply({
    id,
    executor,
  }: MarkInterviewAsDeployedDto): Promise<void> {
    const interview = await this.interviewsRepository.findById(id);

    if (interview.creatorId !== executor.id) {
      throw new ForbiddenException();
    }

    const isDeployed = await this.interviewContractService.isDeployed(
      interview.address,
    );

    if (!isDeployed) {
      throw new InterviewNotDeployedException();
    }

    interview.isDeployed = true;
    const { plain } = await this.interviewsRepository.update(interview.plain);

    await this.addNotificationCase.apply({
      type: NotificationType.interviewScheduled,
      content: {
        interview: {
          id: plain.id,
          startAt: plain.startAt,
        },
        creator: {
          id: executor.id,
          fullName: executor.fullName,
          accountAddress: executor.accountAddress,
        },
      },
      userId: executor.id,
    });
  }
}
