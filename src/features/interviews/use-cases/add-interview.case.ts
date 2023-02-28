import { Injectable } from '@nestjs/common';

import InterviewContractService from '@common/ton/interview-contract.service';
import AddInterviewDto from './dto/add-interview.dto';
import InterviewsRepository from '../interviews.repository';
import { InterviewFactory, PlainInterview } from '../entities';
import {
  AddressNotUniqueException,
  ContractMalformedException,
  InterviewInPastException,
  InvalidInterviewEndDateException,
} from '../exceptions';

@Injectable()
export default class AddInterviewCase {
  constructor(
    private readonly interviewsRepository: InterviewsRepository,
    private readonly interviewFactory: InterviewFactory,
    private readonly interviewContractService: InterviewContractService,
  ) {}

  public async apply(dto: AddInterviewDto): Promise<PlainInterview> {
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

    if (dto.startAt < new Date()) {
      throw new InterviewInPastException();
    }

    if (dto.endAt <= dto.startAt) {
      throw new InvalidInterviewEndDateException();
    }

    const isAddressTaken = await this.interviewsRepository.isAddressTaken(
      dto.address,
    );

    if (isAddressTaken) {
      throw new AddressNotUniqueException();
    }

    const { plain } = await this.interviewsRepository.create(interview.plain);

    return {
      id: plain.id,
      address: plain.address,
      price: plain.price,
      startAt: plain.startAt,
      endAt: plain.endAt,
      status: plain.status,
      creatorId: plain.creatorId,
      participant: plain.participant,
      payerComment: plain.payerComment,
      isDeployed: plain.isDeployed,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    };
  }
}
