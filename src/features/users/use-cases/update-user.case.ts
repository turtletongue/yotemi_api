import { Injectable, UnauthorizedException } from '@nestjs/common';

import UpdateUserDto from './dto/update-user.dto';
import UsersRepository from '../users.repository';
import { PlainUser, UserFactory } from '../entities';

@Injectable()
export default class UpdateUserCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userFactory: UserFactory,
  ) {}

  public async apply(dto: UpdateUserDto): Promise<PlainUser> {
    if (dto.id !== dto.executor.getId()) {
      throw new UnauthorizedException();
    }

    const existingProperties = await this.usersRepository.findById(dto.id);
    const user = await this.userFactory.build({
      ...existingProperties.getPlain(),
      ...dto,
    });

    const updatedUser = await this.usersRepository.update(user.getPlain());
    const plain = updatedUser.getPlain();

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
