import { Injectable } from '@nestjs/common';

import TopicsRepository from '@features/topics/topics.repository';
import AddUserDto from './dto/add-user.dto';
import UsersRepository from '../users.repository';
import {
  AddressIsTakenException,
  TooManyTopicsException,
  UsernameIsTakenException,
} from '../exceptions';
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

    const isUsernameTaken = await this.usersRepository.isUsernameTaken(
      dto.username,
    );

    if (isUsernameTaken) {
      throw new UsernameIsTakenException();
    }

    if (user.hasTooManyTopics) {
      throw new TooManyTopicsException();
    }

    return await this.usersRepository
      .create(user.plain)
      .then(({ plain }) => plain);
  }
}
