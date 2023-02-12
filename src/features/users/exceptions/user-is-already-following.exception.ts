import { UnprocessableEntityException } from '@nestjs/common';

export default class UserIsAlreadyFollowingException extends UnprocessableEntityException {
  constructor() {
    super('You are already a follower of this user', {
      description: 'USER_IS_ALREADY_FOLLOWING',
    });
  }
}
