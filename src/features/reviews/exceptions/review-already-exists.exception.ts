import { UnprocessableEntityException } from '@nestjs/common';

export default class ReviewAlreadyExistsException extends UnprocessableEntityException {
  constructor() {
    super('Review is already exists', {
      description: 'REVIEW_ALREADY_EXISTS',
    });
  }
}
