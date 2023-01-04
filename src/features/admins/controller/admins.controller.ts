import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Id } from '@app/app.declarations';
import { AccessGuard, RoleGuard } from '@features/authentication/guards';
import GetAdminDto from './dto/get-admin.dto';
import ListAdminsDto, { ListAdminsParams } from './dto/list-admins.dto';
import PostAdminDto from './dto/post-admin.dto';
import AdminsService from './admins.service';
import PatchAdminDto from './dto/patch-admin.dto';

@ApiTags('admins')
@ApiBearerAuth()
@UseGuards(AccessGuard, RoleGuard('admin'))
@Controller('admins')
export default class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  /**
   * Get paginated list of admins.
   */
  @Get()
  public async find(@Query() params: ListAdminsParams): Promise<ListAdminsDto> {
    return await this.adminsService.findAdmins(params);
  }

  /**
   * Get single admin by id.
   */
  @Get(':id')
  public async getById(@Param('id') id: Id): Promise<GetAdminDto> {
    return await this.adminsService.getAdminById(id);
  }

  /**
   * Create new admin.
   */
  @Post()
  public async create(@Body() dto: PostAdminDto): Promise<GetAdminDto> {
    return await this.adminsService.addAdmin(dto);
  }

  /**
   * Update some administrator's fields.
   */
  @Patch(':id')
  public async update(
    @Param('id') id: Id,
    @Body() dto: PatchAdminDto,
  ): Promise<GetAdminDto> {
    return await this.adminsService.updateAdmin({ ...dto, id });
  }

  /**
   * Delete admin.
   */
  @Delete(':id')
  public async delete(@Param('id') id: Id): Promise<GetAdminDto> {
    return await this.adminsService.deleteAdmin(id);
  }
}
