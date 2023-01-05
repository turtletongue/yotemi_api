import { UnprocessableEntityException } from '@nestjs/common';

export default class InvalidInterviewStatusChangeException extends UnprocessableEntityException {
  constructor(message: string) {
    super(message, { description: 'INVALID_INTERVIEW_STATUS_CHANGE' });
  }
}
