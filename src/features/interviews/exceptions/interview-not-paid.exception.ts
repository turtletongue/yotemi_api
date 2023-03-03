import { UnprocessableEntityException } from '@nestjs/common';

export default class InterviewNotPaidException extends UnprocessableEntityException {
  constructor() {
    super('Interview is not paid', {
      description: 'INTERVIEW_NOT_PAID',
    });
  }
}
