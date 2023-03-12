import { Injectable } from '@nestjs/common';

import { Id } from '@app/app.declarations';
import UsersRepository from '../users.repository';
import { UserAlreadyBlockedException } from '../exceptions';

@Injectable()
export default class BlockUserCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async apply(id: Id): Promise<void> {
    const user = await this.usersRepository.findById(id);

    if (user.isBlocked) {
      throw new UserAlreadyBlockedException();
    }

    await this.usersRepository.update(user.block().plain);
  }
}
