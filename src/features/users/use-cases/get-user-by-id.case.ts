import { Injectable } from '@nestjs/common';

import { Id } from '@app/app.declarations';
import UsersRepository from '../users.repository';
import { PlainUser } from '../entities';

@Injectable()
export default class GetUserByIdCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async apply(id: Id): Promise<PlainUser> {
    return await this.usersRepository.findById(id).then(({ plain }) => plain);
  }
}
