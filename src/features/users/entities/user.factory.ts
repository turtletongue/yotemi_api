import { Injectable } from '@nestjs/common';

import { IdentifiersService } from '@common/identifiers';
import { TopicFactory } from '@features/topics/entities';
import BuildUserDto from './dto/build-user.dto';
import UserEntity from './user.entity';

@Injectable()
export default class UserFactory {
  constructor(
    private readonly identifiers: IdentifiersService,
    private readonly topicFactory: TopicFactory,
  ) {}

  public async build({
    id = this.identifiers.generate(),
    username,
    accountAddress,
    authId = this.identifiers.generate(),
    topics = [],
    firstName,
    lastName,
    biography = '',
    avatarPath = null,
    coverPath = null,
    isVerified = false,
    followersCount = 0,
    averagePoints = 0,
    reviewsCount = 0,
    isBlocked = false,
    isFollowing = null,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: BuildUserDto): Promise<UserEntity> {
    const topicEntities = await Promise.all(
      topics.map(async (topic) => await this.topicFactory.build(topic)),
    );

    return new UserEntity(
      id,
      username,
      accountAddress,
      authId,
      firstName,
      lastName,
      biography,
      avatarPath,
      coverPath,
      isVerified,
      topicEntities,
      followersCount.toString(),
      averagePoints,
      reviewsCount.toString(),
      isBlocked,
      isFollowing,
      createdAt,
      updatedAt,
    );
  }
}
