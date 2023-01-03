import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserEntity } from '@features/users/entities';
import { AdminEntity } from '@features/admins/entities';

const Executor = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return user as UserEntity | AdminEntity;
  },
);

export default Executor;
