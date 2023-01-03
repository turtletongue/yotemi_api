import { Injectable } from '@nestjs/common';

import ChangeAdminPasswordCase from '@features/admins/use-cases/change-admin-password.case';
import GetAdminDto from '@features/admins/controller/dto/get-admin.dto';
import ChangePasswordDto from './dto/change-password.dto';

@Injectable()
export default class PasswordChangingService {
  constructor(
    private readonly changeAdminPasswordCase: ChangeAdminPasswordCase,
  ) {}

  public async changeAdminPassword(
    dto: ChangePasswordDto,
  ): Promise<GetAdminDto> {
    return await this.changeAdminPasswordCase.apply(dto);
  }
}
