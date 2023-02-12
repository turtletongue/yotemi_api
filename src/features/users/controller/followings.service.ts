import { Injectable } from '@nestjs/common';

import PostFollowingDto from './dto/post-following.dto';
import DeleteFollowingDto from './dto/delete-following.dto';
import FollowUserCase from '../use-cases/follow-user.case';
import UnfollowUserCase from '../use-cases/unfollow-user.case';
import { UserEntity } from '../entities';

@Injectable()
export default class FollowingsService {
  constructor(
    private readonly followUserCase: FollowUserCase,
    private readonly unfollowUserCase: UnfollowUserCase,
  ) {}

  public async follow(
    dto: PostFollowingDto,
    executor: UserEntity,
  ): Promise<void> {
    return await this.followUserCase.apply({ ...dto, followerId: executor.id });
  }

  public async unfollow(
    dto: DeleteFollowingDto,
    executor: UserEntity,
  ): Promise<void> {
    return await this.unfollowUserCase.apply({
      ...dto,
      followerId: executor.id,
    });
  }
}
