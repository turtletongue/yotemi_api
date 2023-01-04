import { Injectable, UnauthorizedException } from '@nestjs/common';

import DeleteUserDto from './dto/delete-user.dto';
import UsersRepository from '../users.repository';
import { PlainUser } from '../entities';

@Injectable()
export default class DeleteUserCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async apply({ id, executor }: DeleteUserDto): Promise<PlainUser> {
    if (id !== executor.getId()) {
      throw new UnauthorizedException();
    }

    const user = await this.usersRepository.delete(id);
    const plain = user.getPlain();

    return {
      id: plain.id,
      accountAddress: plain.accountAddress,
      authId: plain.authId,
      fullName: plain.fullName,
      biography: plain.biography,
      isVerified: plain.isVerified,
      topics: plain.topics,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    };
  }
}
