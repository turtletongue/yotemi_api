import AddUserCase from './add-user.case';
import FindUsersCase from './find-users.case';
import GetUserByIdCase from './get-user-by-id.case';
import UpdateUserCase from './update-user.case';
import DeleteUserCase from './delete-user.case';
import CheckUserAuthIdCase from './check-user-auth-id.case';

const userUseCases = [
  FindUsersCase,
  GetUserByIdCase,
  AddUserCase,
  UpdateUserCase,
  DeleteUserCase,
  CheckUserAuthIdCase,
];

export default userUseCases;
