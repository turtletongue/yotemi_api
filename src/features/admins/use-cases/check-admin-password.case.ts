import { Injectable, UnauthorizedException } from '@nestjs/common';

import CheckAdminPasswordDto from './dto/check-admin-password.dto';
import AdminsRepository from '../admins.repository';
import { PlainAdmin } from '../entities';

@Injectable()
export default class CheckAdminPasswordCase {
  constructor(private readonly adminsRepository: AdminsRepository) {}

  public async apply({
    username,
    password,
  }: CheckAdminPasswordDto): Promise<Omit<PlainAdmin, 'password'>> {
    const admin = await this.adminsRepository.findByUsername(username);
    const isMatch = await admin.isPasswordMatch(password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const plain = admin.getPlain();

    return {
      id: plain.id,
      username: plain.username,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    };
  }
}
