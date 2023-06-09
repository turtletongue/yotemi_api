import { Injectable } from '@nestjs/common';

import ChangeAdminPasswordDto from './dto/change-admin-password.dto';
import AdminsRepository from '../admins.repository';
import { AdminFactory, PlainAdmin } from '../entities';

@Injectable()
export default class ChangeAdminPasswordCase {
  constructor(
    private readonly adminsRepository: AdminsRepository,
    private readonly adminFactory: AdminFactory,
  ) {}

  public async apply(
    dto: ChangeAdminPasswordDto,
  ): Promise<Omit<PlainAdmin, 'password'>> {
    const existingProperties = await this.adminsRepository.findById(dto.id);
    const admin = await this.adminFactory.build({
      ...existingProperties.plain,
      ...dto,
    });

    const { plain } = await this.adminsRepository.update(admin.plain);

    return {
      id: plain.id,
      username: plain.username,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    };
  }
}
