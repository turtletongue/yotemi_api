import { Injectable, UnauthorizedException } from '@nestjs/common';

import CheckUserAuthIdDto from './dto/check-user-auth-id.dto';
import UsersRepository from '../users.repository';
import { PlainUser, UserFactory } from '../entities';

@Injectable()
export default class CheckUserAuthIdCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userFactory: UserFactory,
  ) {}

  public async apply({
    accountAddress,
    authId,
  }: CheckUserAuthIdDto): Promise<PlainUser> {
    const user = await this.usersRepository.findByAccountAddress(
      accountAddress,
    );

    if (user.getAuthId() !== authId) {
      throw new UnauthorizedException();
    }

    const userWithNewAuthId = await this.userFactory.build({
      ...user.getPlain(),
      authId: undefined,
    });
    const updatedUser = await this.usersRepository.update(
      userWithNewAuthId.getPlain(),
    );

    const plain = updatedUser.getPlain();

    return {
      id: plain.id,
      accountAddress: plain.accountAddress,
      fullName: plain.fullName,
      biography: plain.biography,
      authId: plain.authId,
      isVerified: plain.isVerified,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    };
  }
}
