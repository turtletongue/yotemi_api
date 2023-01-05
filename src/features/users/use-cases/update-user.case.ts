import { Injectable, UnauthorizedException } from '@nestjs/common';

import TopicsRepository from '@features/topics/topics.repository';
import UpdateUserDto from './dto/update-user.dto';
import UsersRepository from '../users.repository';
import { PlainUser, UserFactory } from '../entities';

@Injectable()
export default class UpdateUserCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userFactory: UserFactory,
    private readonly topicsRepository: TopicsRepository,
  ) {}

  public async apply(dto: UpdateUserDto): Promise<PlainUser> {
    if (dto.id !== dto.executor.getId()) {
      throw new UnauthorizedException();
    }

    const topics = await this.topicsRepository.findByIds(dto.topics);

    const existingProperties = await this.usersRepository.findById(dto.id);
    const user = await this.userFactory.build({
      ...existingProperties.getPlain(),
      ...dto,
      topics: topics.map((topic) => topic.getPlain()),
    });

    const updatedUser = await this.usersRepository.update(user.getPlain());
    const plain = updatedUser.getPlain();

    return {
      id: plain.id,
      accountAddress: plain.accountAddress,
      authId: plain.authId,
      fullName: plain.fullName,
      biography: plain.biography,
      isVerified: plain.isVerified,
      topics: plain.topics,
      followersCount: plain.followersCount,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    };
  }
}
