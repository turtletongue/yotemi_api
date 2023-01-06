import { Injectable } from '@nestjs/common';

import TopicsRepository from '@features/topics/topics.repository';
import AddUserDto from './dto/add-user.dto';
import UsersRepository from '../users.repository';
import { AddressIsTakenException } from '../exceptions';
import { PlainUser, UserFactory } from '../entities';

@Injectable()
export default class AddUserCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userFactory: UserFactory,
    private readonly topicsRepository: TopicsRepository,
  ) {}

  public async apply(dto: AddUserDto): Promise<PlainUser> {
    const topics = await this.topicsRepository.findByIds(dto.topics);
    const user = await this.userFactory.build({
      ...dto,
      topics: topics.map((topic) => topic.plain),
    });

    const isAddressTaken = await this.usersRepository.isAccountAddressTaken(
      dto.accountAddress,
    );

    if (isAddressTaken) {
      throw new AddressIsTakenException();
    }

    const { plain } = await this.usersRepository.create(user.plain);

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
