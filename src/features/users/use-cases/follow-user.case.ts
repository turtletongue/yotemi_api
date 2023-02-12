import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';

import AddNotificationCase from '@features/notifications/use-cases/add-notification.case';
import { NotificationAlreadyExistsException } from '@features/notifications/exceptions';
import FollowUserDto from './dto/follow-user.dto';
import UsersRepository from '../users.repository';
import {
  SelfFollowingNotAllowedException,
  UserIsAlreadyFollowingException,
} from '../exceptions';

@Injectable()
export default class FollowUserCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly addNotificationCase: AddNotificationCase,
  ) {}

  public async apply(dto: FollowUserDto): Promise<void> {
    if (dto.followingId === dto.followerId) {
      throw new SelfFollowingNotAllowedException();
    }

    const isFollowing = await this.usersRepository.isFollowing(
      dto.followingId,
      dto.followerId,
    );

    if (isFollowing) {
      throw new UserIsAlreadyFollowingException();
    }

    const follower = await this.usersRepository.findById(dto.followerId);

    try {
      await this.addNotificationCase.apply({
        type: NotificationType.newFollower,
        content: {
          follower: {
            id: follower.id,
            fullName: follower.fullName,
          },
        },
        userId: dto.followingId,
      });
    } catch (error: unknown) {
      if (!(error instanceof NotificationAlreadyExistsException)) {
        throw error;
      }
    }

    await this.usersRepository.follow(dto.followingId, dto.followerId);
  }
}
