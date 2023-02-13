import { UnprocessableEntityException } from '@nestjs/common';

export default class InterviewHasTimeConflictException extends UnprocessableEntityException {
  constructor() {
    super(
      'The interview has time conflict with another interview from this user',
      {
        description: 'INTERVIEW_HAS_TIME_CONFLICT',
      },
    );
  }
}
