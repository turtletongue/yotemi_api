import { UnprocessableEntityException } from '@nestjs/common';

export default class NotificationAlreadyExistsException extends UnprocessableEntityException {
  constructor() {
    super('This notification is already exists', {
      description: 'NOTIFICATION_ALREADY_EXISTS',
    });
  }
}
