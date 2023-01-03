import { Injectable } from '@nestjs/common';

import { Id } from '@app/app.declarations';
import UsersRepository from '../users.repository';
import { PlainUser } from '../entities';

@Injectable()
export default class GetUserByIdCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async apply(id: Id): Promise<PlainUser> {
    const user = await this.usersRepository.findById(id);
    const plain = user.getPlain();

    return {
      id: plain.id,
      accountAddress: plain.accountAddress,
      authId: plain.authId,
      fullName: plain.fullName,
      biography: plain.biography,
      isVerified: plain.isVerified,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    };
  }
}
