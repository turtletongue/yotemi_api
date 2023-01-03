import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

import { UserEntity } from '@features/users/entities';

const User = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;

  if (!(user instanceof UserEntity)) {
    throw new InternalServerErrorException('User cannot be retrieved');
  }

  return user as UserEntity;
});

export default User;
