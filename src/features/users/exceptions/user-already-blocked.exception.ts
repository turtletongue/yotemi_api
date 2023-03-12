import { UnprocessableEntityException } from '@nestjs/common';

export default class UserAlreadyBlockedException extends UnprocessableEntityException {
  constructor() {
    super('User is already blocked', {
      description: 'USER_ALREADY_BLOCKED',
    });
  }
}
