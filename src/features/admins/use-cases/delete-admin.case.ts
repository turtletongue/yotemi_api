import { Injectable } from '@nestjs/common';

import DeleteAdminDto from './dto/delete-admin.dto';
import AdminsRepository from '../admins.repository';
import { PlainAdmin } from '../entities';

@Injectable()
export default class DeleteAdminCase {
  constructor(private readonly adminsRepository: AdminsRepository) {}

  public async apply({
    id,
  }: DeleteAdminDto): Promise<Omit<PlainAdmin, 'password'>> {
    const admin = await this.adminsRepository.delete(id);
    const plain = admin.getPlain();

    return {
      id: plain.id,
      username: plain.username,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    };
  }
}
