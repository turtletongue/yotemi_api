import { UnauthorizedException } from '@nestjs/common';

export default class SignatureExpiredException extends UnauthorizedException {
  constructor() {
    super('Signature expired', { description: 'TON_SIGNATURE_EXPIRED' });
  }
}
