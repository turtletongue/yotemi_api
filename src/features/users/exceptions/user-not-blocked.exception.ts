import { UnprocessableEntityException } from '@nestjs/common';

export default class UserNotBlockedException extends UnprocessableEntityException {
  constructor() {
    super('User is not blocked', {
      description: 'USER_NOT_BLOCKED',
    });
  }
}
