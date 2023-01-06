import { NotFoundException } from '@nestjs/common';

export default class InterviewMessageNotFoundException extends NotFoundException {
  constructor() {
    super('Interview message is not found', {
      description: 'INTERVIEW_MESSAGE_NOT_FOUND',
    });
  }
}
