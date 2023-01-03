import { NotFoundException } from '@nestjs/common';

export default class AdminNotFoundException extends NotFoundException {
  constructor() {
    super('Admin not found', { description: 'ADMIN_NOT_FOUND' });
  }
}
