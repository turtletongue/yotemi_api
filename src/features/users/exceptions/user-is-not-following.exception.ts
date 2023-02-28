import { UnprocessableEntityException } from '@nestjs/common';

export default class UserIsNotFollowingException extends UnprocessableEntityException {
  constructor() {
    super('You are not a follower of this user', {
      description: 'USER_IS_NOT_FOLLOWING',
    });
  }
}
