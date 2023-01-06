import { Injectable } from '@nestjs/common';

import AddAdminDto from './dto/add-admin.dto';
import AdminsRepository from '../admins.repository';
import { UsernameIsTakenException } from '../exceptions';
import { AdminFactory, PlainAdmin } from '../entities';

@Injectable()
export default class AddAdminCase {
  constructor(
    private readonly adminsRepository: AdminsRepository,
    private readonly adminFactory: AdminFactory,
  ) {}

  public async apply(dto: AddAdminDto): Promise<Omit<PlainAdmin, 'password'>> {
    const admin = await this.adminFactory.build(dto);

    const isUsernameTaken = await this.adminsRepository.isUsernameTaken(
      admin.username,
    );

    if (isUsernameTaken) {
      throw new UsernameIsTakenException();
    }

    const { plain } = await this.adminsRepository.create(admin.plain);

    return {
      id: plain.id,
      username: plain.username,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    };
  }
}
