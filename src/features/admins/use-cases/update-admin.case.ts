import { Injectable } from '@nestjs/common';

import UpdateAdminDto from './dto/update-admin.dto';
import AdminsRepository from '../admins.repository';
import { UsernameIsTakenException } from '../exceptions';
import { AdminFactory, PlainAdmin } from '../entities';

@Injectable()
export default class UpdateAdminCase {
  constructor(
    private readonly adminsRepository: AdminsRepository,
    private readonly adminFactory: AdminFactory,
  ) {}

  public async apply(
    dto: UpdateAdminDto,
  ): Promise<Omit<PlainAdmin, 'password'>> {
    if (dto.username) {
      const isUsernameTaken = await this.adminsRepository.isUsernameTaken(
        dto.username,
      );

      if (isUsernameTaken) {
        throw new UsernameIsTakenException();
      }
    }

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
