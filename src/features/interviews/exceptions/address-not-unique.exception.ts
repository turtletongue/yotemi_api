import { UnprocessableEntityException } from '@nestjs/common';

export default class AddressNotUniqueException extends UnprocessableEntityException {
  constructor() {
    super('Interview address is not unique', {
      description: 'ADDRESS_NOT_UNIQUE',
    });
  }
}
