import { NotFoundException } from '@nestjs/common';

export default class UserNotFoundException extends NotFoundException {
  constructor() {
    super('User is not found', { description: 'USER_NOT_FOUND' });
  }
}
