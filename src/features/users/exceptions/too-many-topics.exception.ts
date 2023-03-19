import { UnprocessableEntityException } from '@nestjs/common';

export default class TooManyTopicsException extends UnprocessableEntityException {
  constructor() {
    super(`Too many topics linked to user`, {
      description: 'TOO_MANY_TOPICS',
    });
  }
}
