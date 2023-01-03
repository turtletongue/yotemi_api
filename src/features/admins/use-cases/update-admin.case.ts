import { Injectable } from '@nestjs/common';

import UpdateAdminDto from './dto/update-admin.dto';
import AdminsRepository from '../admins.repository';
import { UsernameIsTakenException } from '../exceptions';
import { PlainAdmin } from '../entities';

@Injectable()
export default class UpdateAdminCase {
  constructor(private readonly adminsRepository: AdminsRepository) {}

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

    const admin = await this.adminsRepository.update(dto);
    const plain = admin.getPlain();

    return {
      id: plain.id,
      username: plain.username,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    };
  }
}
