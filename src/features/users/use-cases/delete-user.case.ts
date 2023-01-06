import { Injectable, UnauthorizedException } from '@nestjs/common';

import DeleteUserDto from './dto/delete-user.dto';
import UsersRepository from '../users.repository';
import { PlainUser } from '../entities';

@Injectable()
export default class DeleteUserCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async apply({ id, executor }: DeleteUserDto): Promise<PlainUser> {
    if (id !== executor.id) {
      throw new UnauthorizedException();
    }

    const { plain } = await this.usersRepository.delete(id);

    return {
      id: plain.id,
      accountAddress: plain.accountAddress,
      authId: plain.authId,
      fullName: plain.fullName,
      biography: plain.biography,
      isVerified: plain.isVerified,
      topics: plain.topics,
      followersCount: plain.followersCount,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    };
  }
}
