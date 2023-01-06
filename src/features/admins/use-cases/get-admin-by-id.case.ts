import { Injectable } from '@nestjs/common';

import { Id } from '@app/app.declarations';
import AdminsRepository from '../admins.repository';
import { PlainAdmin } from '../entities';

@Injectable()
export default class GetAdminByIdCase {
  constructor(private readonly adminsRepository: AdminsRepository) {}

  public async apply(id: Id): Promise<Omit<PlainAdmin, 'password'>> {
    const { plain } = await this.adminsRepository.findById(id);

    return {
      id: plain.id,
      username: plain.username,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    };
  }
}
