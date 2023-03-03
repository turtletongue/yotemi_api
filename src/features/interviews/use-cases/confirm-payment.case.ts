import { Injectable } from '@nestjs/common';
import { PlainInterview } from '../entities';

import InterviewContractService from '@common/ton/interview-contract.service';
import ConfirmPaymentDto from './dto/confirm-payment.dto';
import InterviewsRepository from '../interviews.repository';
import {
  InterviewNotPaidException,
  NotPayerException,
  PaymentAlreadyConfirmedException,
} from '../exceptions';

@Injectable()
export default class ConfirmPaymentCase {
  constructor(
    private readonly interviewsRepository: InterviewsRepository,
    private readonly interviewContractService: InterviewContractService,
  ) {}

  public async apply(dto: ConfirmPaymentDto): Promise<PlainInterview> {
    const interview = await this.interviewsRepository.findById(dto.id);

    const { status, payerAddress } =
      await this.interviewContractService.getInfo(interview.address);

    if (status !== 'paid') {
      throw new InterviewNotPaidException();
    }

    if (payerAddress !== dto.executor.accountAddress) {
      throw new NotPayerException();
    }

    if (interview.participant) {
      throw new PaymentAlreadyConfirmedException();
    }

    interview.participant = dto.executor;
    interview.payerComment = dto.comment;

    return await this.interviewsRepository
      .update(interview.plain)
      .then(({ plain }) => plain);
  }
}
