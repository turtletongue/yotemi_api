import { UnprocessableEntityException } from '@nestjs/common';

export default class NotUniqueLabelLanguageException extends UnprocessableEntityException {
  constructor() {
    super('Labels that belongs to one topic must have different languages', {
      description: 'NOT_UNIQUE_LABEL_LANGUAGE',
    });
  }
}
