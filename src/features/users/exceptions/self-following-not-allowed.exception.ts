import { UnprocessableEntityException } from '@nestjs/common';

export default class SelfFollowingNotAllowedException extends UnprocessableEntityException {
  constructor() {
    super('Self following is not allowed', {
      description: 'SELF_FOLLOWING_NOT_ALLOWED',
    });
  }
}
