import { UnprocessableEntityException } from '@nestjs/common';

export default class InterviewInPastException extends UnprocessableEntityException {
  constructor() {
    super('Cannot create an interview in the past', {
      description: 'INTERVIEW_IN_PAST',
    });
  }
}
