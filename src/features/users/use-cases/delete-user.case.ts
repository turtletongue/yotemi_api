import { ForbiddenException, Injectable } from '@nestjs/common';

import DeleteUserDto from './dto/delete-user.dto';
import UsersRepository from '../users.repository';
import { PlainUser } from '../entities';

@Injectable()
export default class DeleteUserCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async apply({ id, executor }: DeleteUserDto): Promise<PlainUser> {
    if (id !== executor.id) {
      throw new ForbiddenException();
    }

    return await this.usersRepository.delete(id).then(({ plain }) => plain);
  }
}
