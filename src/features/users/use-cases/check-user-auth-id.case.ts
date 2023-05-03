import { Injectable, UnauthorizedException } from '@nestjs/common';

import CheckUserAuthIdDto from './dto/check-user-auth-id.dto';
import UsersRepository from '../users.repository';
import { PlainUser, UserFactory } from '../entities';
import { Id } from '@app/app.declarations';

@Injectable()
export default class CheckUserAuthIdCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userFactory: UserFactory,
  ) {}

  public async apply({
    accountAddress,
    authId,
  }: CheckUserAuthIdDto): Promise<PlainUser & { followingsIds: Id[] }> {
    const user = await this.usersRepository.findByAccountAddress(
      accountAddress,
    );

    if (user.authId !== authId) {
      throw new UnauthorizedException();
    }

    const userWithNewAuthId = await this.userFactory.build({
      ...user.plain,
      authId: undefined,
    });

    const { plain } = await this.usersRepository.update(
      userWithNewAuthId.plain,
    );

    const followingsIds = await this.usersRepository.findFollowingIds(plain.id);

    return { ...plain, followingsIds };
  }
}
