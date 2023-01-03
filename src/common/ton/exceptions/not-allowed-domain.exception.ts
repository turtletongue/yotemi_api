import { UnauthorizedException } from '@nestjs/common';

export default class NotAllowedDomainException extends UnauthorizedException {
  constructor() {
    super('Domain what requested signature is not allowed', {
      description: 'NOT_ALLOWED_TON_DOMAIN',
    });
  }
}
