import { UnprocessableEntityException } from '@nestjs/common';

export default class NotPayerException extends UnprocessableEntityException {
  constructor() {
    super('Your wallet address does not match the payer address', {
      description: 'NOT_PAYER_EXCEPTION',
    });
  }
}
