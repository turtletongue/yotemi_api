import { ForbiddenException, Injectable } from '@nestjs/common';

import TopicsRepository from '@features/topics/topics.repository';
import UpdateUserDto from './dto/update-user.dto';
import UsersRepository from '../users.repository';
import { PlainUser, UserFactory } from '../entities';
import {
  TooManyTopicsException,
  UsernameIsTakenException,
} from '../exceptions';

@Injectable()
export default class UpdateUserCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userFactory: UserFactory,
    private readonly topicsRepository: TopicsRepository,
  ) {}

  public async apply(dto: UpdateUserDto): Promise<PlainUser> {
    if (dto.id !== dto.executor.id) {
      throw new ForbiddenException();
    }

    if (dto.username) {
      const isUsernameTaken = await this.usersRepository.isUsernameTaken(
        dto.username,
        dto.id,
      );

      if (isUsernameTaken) {
        throw new UsernameIsTakenException();
      }
    }

    const topics = await this.topicsRepository.findByIds(dto.topics);

    const existingProperties = await this.usersRepository.findById(dto.id);
    const user = await this.userFactory.build({
      ...existingProperties.plain,
      ...dto,
      topics: topics.map((topic) => topic.plain),
    });

    if (user.hasTooManyTopics) {
      throw new TooManyTopicsException();
    }

    return await this.usersRepository
      .update(user.plain)
      .then(({ plain }) => plain);
  }
}
