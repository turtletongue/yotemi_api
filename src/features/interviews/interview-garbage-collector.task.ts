import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DateTime } from 'luxon';

import InterviewContractService from '@common/ton/interview-contract.service';
import InterviewsRepository from './interviews.repository';

const PROCESSING_LIMIT = 100;

@Injectable()
export default class InterviewGarbageCollectorTask {
  private readonly logger = new Logger(InterviewGarbageCollectorTask.name);

  constructor(
    private readonly interviewsRepository: InterviewsRepository,
    private readonly interviewContractService: InterviewContractService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  public async handle(): Promise<void> {
    const interviews = await this.interviewsRepository.findAll({
      where: {
        createdAt: {
          lte: DateTime.now().minus({ months: 2 }).toJSDate(),
        },
      },
      take: PROCESSING_LIMIT,
    });

    try {
      await Promise.all(
        interviews.map(async (interview) => {
          const info = await this.interviewContractService.getInfo(
            interview.address,
          );

          if (info) {
            return;
          }

          await this.interviewsRepository.delete(interview.id);
        }),
      );
    } catch (error) {
      this.logger.warn('Interview garbage collection failed: ', error);
    }
  }
}
