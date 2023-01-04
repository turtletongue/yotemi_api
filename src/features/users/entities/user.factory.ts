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
    accountAddress,
    authId = this.identifiers.generate(),
    topics = [],
    fullName,
    biography = '',
    isVerified = false,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: BuildUserDto): Promise<UserEntity> {
    const topicEntities = await Promise.all(
      topics.map(async (topic) => await this.topicFactory.build(topic)),
    );

    return new UserEntity(
      id,
      accountAddress,
      authId,
      fullName,
      biography,
      isVerified,
      topicEntities,
      createdAt,
      updatedAt,
    );
  }
}
