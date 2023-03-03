import { UnprocessableEntityException } from '@nestjs/common';

export default class PaymentAlreadyConfirmedException extends UnprocessableEntityException {
  constructor() {
    super('Payment is already confirmed', {
      description: 'PAYMENT_ALREADY_CONFIRMED',
    });
  }
}
