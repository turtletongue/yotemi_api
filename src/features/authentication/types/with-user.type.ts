import { UserEntity } from '@features/users/entities';
import { AdminEntity } from '@features/admins/entities';

type WithUser<T> = T & { user: UserEntity | AdminEntity };

export default WithUser;
