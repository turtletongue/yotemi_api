import { NotFoundException } from '@nestjs/common';

export default class ReviewNotFoundException extends NotFoundException {
  constructor() {
    super('Review is not found', { description: 'REVIEW_NOT_FOUND' });
  }
}
