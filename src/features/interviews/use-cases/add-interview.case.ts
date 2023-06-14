import { Injectable } from '@nestjs/common';

import InterviewContractService from '@common/ton/interview-contract.service';
import AddInterviewDto from './dto/add-interview.dto';
import CheckInterviewTimeConflictCase from './check-interview-time-conflict.case';
import InterviewsRepository from '../interviews.repository';
import { InterviewFactory, PlainInterview } from '../entities';
import { ContractMalformedException } from '../exceptions';

@Injectable()
export default class AddInterviewCase {
  constructor(
    private readonly interviewsRepository: InterviewsRepository,
    private readonly interviewFactory: InterviewFactory,
    private readonly interviewContractService: InterviewContractService,
    private readonly checkInterviewTimeConflictCase: CheckInterviewTimeConflictCase,
  ) {}

  public async apply(dto: AddInterviewDto): Promise<PlainInterview> {
    const existingInterview = await this.interviewsRepository.findByAddress(
      dto.address,
    );

    if (existingInterview) {
      return existingInterview.plain;
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

    return await this.interviewsRepository
      .create(interview.plain)
      .then(({ plain }) => plain);
  }
}
