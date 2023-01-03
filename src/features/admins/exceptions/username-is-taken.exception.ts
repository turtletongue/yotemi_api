import { UnprocessableEntityException } from '@nestjs/common';

export default class UsernameIsTakenException extends UnprocessableEntityException {
  constructor() {
    super('Username is already taken', { description: 'USERNAME_IS_TAKEN' });
  }
}
