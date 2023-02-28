import { NotFoundException } from '@nestjs/common';

export default class NotificationNotFoundException extends NotFoundException {
  constructor() {
    super('Notification is not found', {
      description: 'NOTIFICATION_NOT_FOUND',
    });
  }
}
