import { NotFoundException } from '@nestjs/common';

export default class InterviewNotFoundException extends NotFoundException {
  constructor() {
    super('Interview is not found', { description: 'INTERVIEW_NOT_FOUND' });
  }
}
