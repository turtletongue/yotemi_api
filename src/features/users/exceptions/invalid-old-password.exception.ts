import { UnprocessableEntityException } from '@nestjs/common';

export default class InvalidOldPasswordException extends UnprocessableEntityException {
  constructor() {
    super('Invalid old password', { description: 'INVALID_OLD_PASSWORD' });
  }
}
