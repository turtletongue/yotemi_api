import { Injectable } from '@nestjs/common';

import AddUserDto from './dto/add-user.dto';
import UsersRepository from '../users.repository';
import { AddressIsTakenException } from '../exceptions';
import { PlainUser, UserFactory } from '../entities';

@Injectable()
export default class AddUserCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userFactory: UserFactory,
  ) {}

  public async apply(dto: AddUserDto): Promise<PlainUser> {
    const user = await this.userFactory.build(dto);

    const isAddressTaken = await this.usersRepository.isAccountAddressTaken(
      dto.accountAddress,
    );

    if (isAddressTaken) {
      throw new AddressIsTakenException();
    }

    const createdAdmin = await this.usersRepository.create(user.getPlain());
    const plain = createdAdmin.getPlain();

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
