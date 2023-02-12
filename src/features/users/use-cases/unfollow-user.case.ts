import { Injectable } from '@nestjs/common';

import UnfollowUserDto from './dto/unfollow-user.dto';
import UsersRepository from '../users.repository';
import { UserIsNotFollowingException } from '../exceptions';

@Injectable()
export default class UnfollowUserCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async apply(dto: UnfollowUserDto): Promise<void> {
    const isFollowing = await this.usersRepository.isFollowing(
      dto.followingId,
      dto.followerId,
    );

    if (!isFollowing) {
      throw new UserIsNotFollowingException();
    }

    await this.usersRepository.unfollow(dto.followingId, dto.followerId);
  }
}
