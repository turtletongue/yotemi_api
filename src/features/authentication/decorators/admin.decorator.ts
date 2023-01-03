import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

import { AdminEntity } from '@features/admins/entities';

const Admin = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;

  if (!(user instanceof AdminEntity)) {
    throw new InternalServerErrorException('Admin cannot be retrieved');
  }

  return user as AdminEntity;
});

export default Admin;
