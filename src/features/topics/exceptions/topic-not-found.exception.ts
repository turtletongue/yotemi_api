import { NotFoundException } from '@nestjs/common';

export default class TopicNotFoundException extends NotFoundException {
  constructor() {
    super('Topic is not found', { description: 'TOPIC_NOT_FOUND' });
  }
}
