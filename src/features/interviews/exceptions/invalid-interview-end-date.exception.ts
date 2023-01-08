import { UnprocessableEntityException } from '@nestjs/common';

export default class InvalidInterviewEndDateException extends UnprocessableEntityException {
  constructor() {
    super('Date of end of the interview must be greater than date of start', {
      description: 'INVALID_INTERVIEW_END_DATE',
    });
  }
}
