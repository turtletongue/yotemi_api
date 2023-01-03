import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';

import { AdminEntity } from '@features/admins/entities';
import { UserEntity } from '@features/users/entities';
import { ExecutorKind, WithUser } from '../types';

const RoleGuard = (role: ExecutorKind): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<WithUser<Request>>();
      const user = request.user;

      return (
        (role === 'admin' && user instanceof AdminEntity) ||
        (role === 'user' && user instanceof UserEntity)
      );
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
