import AddUserCase from './add-user.case';
import FindUsersCase from './find-users.case';
import GetUserByIdCase from './get-user-by-id.case';
import GetUserByUsernameCase from './get-user-by-username.case';
import GetUserByAccountAddressCase from './get-user-by-account-address.case';
import UpdateUserCase from './update-user.case';
import DeleteUserCase from './delete-user.case';
import BlockUserCase from './block-user.case';
import UnblockUserCase from './unblock-user.case';
import CheckUserAuthIdCase from './check-user-auth-id.case';
import FollowUserCase from './follow-user.case';
import UnfollowUserCase from './unfollow-user.case';
import ChangeAvatarCase from './change-avatar.case';
import ChangeCoverCase from './change-cover.case';

const userUseCases = [
  FindUsersCase,
  GetUserByIdCase,
  GetUserByUsernameCase,
  GetUserByAccountAddressCase,
  AddUserCase,
  UpdateUserCase,
  DeleteUserCase,
  BlockUserCase,
  UnblockUserCase,
  CheckUserAuthIdCase,
  FollowUserCase,
  UnfollowUserCase,
  ChangeAvatarCase,
  ChangeCoverCase,
];

export default userUseCases;
