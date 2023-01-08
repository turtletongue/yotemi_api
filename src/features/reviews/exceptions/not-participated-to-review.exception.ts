import { UnprocessableEntityException } from '@nestjs/common';

export default class NotParticipatedToReviewException extends UnprocessableEntityException {
  constructor() {
    super(
      'You cannot review user if you did not participated in his interviews',
      { description: 'NOT_PARTICIPATED_TO_REVIEW' },
    );
  }
}
