import { UnprocessableEntityException } from '@nestjs/common';

export default class InvalidMessagesInterviewStatusException extends UnprocessableEntityException {
  constructor() {
    super('Interview of the message has invalid status', {
      description: 'INVALID_MESSAGES_INTERVIEW_STATUS',
    });
  }
}
