import { NotFoundException } from '@nestjs/common';

export default class UserNotFoundException extends NotFoundException {
  constructor() {
    super('User not found', { description: 'USER_NOT_FOUND' });
  }
}
