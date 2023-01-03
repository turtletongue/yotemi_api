import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import GetAdminDto from '@features/admins/controller/dto/get-admin.dto';
import { AccessGuard, RoleGuard } from '@features/authentication/guards';
import PasswordChangingService from './password-changing.service';
import ChangePasswordDto from './dto/change-password.dto';

@ApiTags('admins')
@ApiBearerAuth()
@UseGuards(AccessGuard, RoleGuard('admin'))
@Controller('password-changing')
export default class PasswordChangingController {
  constructor(
    private readonly passwordChangingService: PasswordChangingService,
  ) {}

  /**
   * Change administrator's password.
   */
  @Post()
  public async changePassword(
    @Body() dto: ChangePasswordDto,
  ): Promise<GetAdminDto> {
    return await this.passwordChangingService.changeAdminPassword(dto);
  }
}
