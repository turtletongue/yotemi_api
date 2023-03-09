import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';

import { AccessGuard, RoleGuard } from '@features/authentication/guards';
import { User } from '@features/authentication/decorators';
import PostFollowingDto from './dto/post-following.dto';
import DeleteFollowingDto from './dto/delete-following.dto';
import FollowingsService from './followings.service';
import { UserEntity } from '../entities';
import {
  SelfFollowingNotAllowedException,
  UserIsAlreadyFollowingException,
  UserIsNotFollowingException,
  UserNotFoundException,
} from '../exceptions';

@ApiTags('followings')
@ApiBearerAuth()
@UseGuards(AccessGuard, RoleGuard('user'))
@Controller('followings')
export default class FollowingsController {
  constructor(private readonly followingsService: FollowingsService) {}

  /**
   * Follow user.
   */
  @ApiException(() => SelfFollowingNotAllowedException, {
    description: 'You cannot follow yourself.',
  })
  @ApiException(() => UserIsAlreadyFollowingException, {
    description: 'You already following this user.',
  })
  @ApiException(() => UserNotFoundException, {
    description: 'User to follow is not found.',
  })
  @ApiCreatedResponse({ description: 'Followed successfully.' })
  @Post()
  public async follow(
    @Body() dto: PostFollowingDto,
    @User() executor: UserEntity,
  ): Promise<void> {
    return await this.followingsService.follow(dto, executor);
  }

  /**
   * Unfollow user.
   */
  @ApiException(() => UserIsNotFollowingException, {
    description: 'You are not a follower of this user.',
  })
  @ApiException(() => UserNotFoundException, {
    description: 'User to unfollow is not found.',
  })
  @ApiOkResponse({ description: 'Unfollowed successfully.' })
  @Delete()
  public async unfollow(
    @Body() dto: DeleteFollowingDto,
    @User() executor: UserEntity,
  ): Promise<void> {
    return await this.followingsService.unfollow(dto, executor);
  }
}
