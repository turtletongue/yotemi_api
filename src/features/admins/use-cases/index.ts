import GetAdminByIdCase from './get-admin-by-id.case';
import FindAdminsCase from './find-admins.case';
import AddAdminCase from './add-admin.case';
import ChangeAdminPasswordCase from './change-admin-password.case';
import CheckAdminPasswordCase from './check-admin-password.case';
import UpdateAdminCase from './update-admin.case';
import DeleteAdminCase from './delete-admin.case';

const adminUseCases = [
  FindAdminsCase,
  GetAdminByIdCase,
  AddAdminCase,
  ChangeAdminPasswordCase,
  CheckAdminPasswordCase,
  UpdateAdminCase,
  DeleteAdminCase,
];

export default adminUseCases;
