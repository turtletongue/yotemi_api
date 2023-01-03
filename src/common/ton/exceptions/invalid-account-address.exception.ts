import { UnprocessableEntityException } from '@nestjs/common';

export default class InvalidAccountAddressException extends UnprocessableEntityException {
  constructor() {
    super('Invalid account address', {
      description: 'INVALID_ACCOUNT_ADDRESS',
    });
  }
}
