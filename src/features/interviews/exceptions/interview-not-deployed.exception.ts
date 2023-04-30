import { UnprocessableEntityException } from '@nestjs/common';

export default class InterviewNotDeployedException extends UnprocessableEntityException {
  constructor() {
    super('Interview is not deployed.', {
      description: 'INTERVIEW_NOT_DEPLOYED',
    });
  }
}
