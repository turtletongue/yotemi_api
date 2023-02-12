import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AccessGuard, RoleGuard } from '@features/authentication/guards';
import { User } from '@features/authentication/decorators';
import PostFollowingDto from './dto/post-following.dto';
import DeleteFollowingDto from './dto/delete-following.dto';
import FollowingsService from './followings.service';
import { UserEntity } from '../entities';

@ApiTags('followings')
@ApiBearerAuth()
@UseGuards(AccessGuard, RoleGuard('user'))
@Controller('followings')
export default class FollowingsController {
  constructor(private readonly followingsService: FollowingsService) {}

  /**
   * Follow user.
   */
  @Post()
  @ApiCreatedResponse({ description: 'Followed successfully.' })
  public async follow(
    @Body() dto: PostFollowingDto,
    @User() executor: UserEntity,
  ): Promise<void> {
    return await this.followingsService.follow(dto, executor);
  }

  /**
   * Unfollow user.
   */
  @Delete()
  @ApiOkResponse({ description: 'Unfollowed successfully.' })
  public async unfollow(
    @Body() dto: DeleteFollowingDto,
    @User() executor: UserEntity,
  ): Promise<void> {
    return await this.followingsService.unfollow(dto, executor);
  }
}
