import { Injectable } from '@nestjs/common';

import { Id } from '@app/app.declarations';
import GetAdminDto from './dto/get-admin.dto';
import PostAdminDto from './dto/post-admin.dto';
import PatchAdminDto from './dto/patch-admin.dto';
import ListAdminsDto, { ListAdminsParams } from './dto/list-admins.dto';
import GetAdminByIdCase from '../use-cases/get-admin-by-id.case';
import AddAdminCase from '../use-cases/add-admin.case';
import UpdateAdminCase from '../use-cases/update-admin.case';
import DeleteAdminCase from '../use-cases/delete-admin.case';
import FindAdminsCase from '../use-cases/find-admins.case';

@Injectable()
export default class AdminsService {
  constructor(
    private readonly getAdminByIdCase: GetAdminByIdCase,
    private readonly findAdminsCase: FindAdminsCase,
    private readonly addAdminCase: AddAdminCase,
    private readonly updateAdminCase: UpdateAdminCase,
    private readonly deleteAdminCase: DeleteAdminCase,
  ) {}

  public async getAdminById(id: Id): Promise<GetAdminDto> {
    return await this.getAdminByIdCase.apply(id);
  }

  public async findAdmins(params: ListAdminsParams): Promise<ListAdminsDto> {
    return await this.findAdminsCase.apply(params);
  }

  public async addAdmin(dto: PostAdminDto): Promise<GetAdminDto> {
    return await this.addAdminCase.apply(dto);
  }

  public async updateAdmin(dto: PatchAdminDto): Promise<GetAdminDto> {
    return await this.updateAdminCase.apply(dto);
  }

  public async deleteAdmin(id: Id): Promise<GetAdminDto> {
    return await this.deleteAdminCase.apply({ id });
  }
}
