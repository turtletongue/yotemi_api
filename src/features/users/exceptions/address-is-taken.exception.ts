import { UnprocessableEntityException } from '@nestjs/common';

export default class AddressIsTakenException extends UnprocessableEntityException {
  constructor() {
    super('Account address is already taken', {
      description: 'ADDRESS_IS_TAKEN',
    });
  }
}
