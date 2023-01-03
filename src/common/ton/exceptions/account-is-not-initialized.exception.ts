import { UnprocessableEntityException } from '@nestjs/common';

export default class AccountIsNotInitializedException extends UnprocessableEntityException {
  constructor() {
    super(
      'Your TON account is not initialized. Please, create outcome transaction and try again',
      { description: 'TON_ACCOUNT_NOT_INITIALIZED' },
    );
  }
}
