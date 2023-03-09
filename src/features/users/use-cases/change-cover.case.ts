import { ForbiddenException, Injectable } from '@nestjs/common';

import { S3Service } from '@common/s3';
import ChangeCoverDto from './dto/change-cover.dto';
import UsersRepository from '../users.repository';

@Injectable()
export default class ChangeCoverCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly s3Service: S3Service,
  ) {}

  public async apply({ id, path, executor }: ChangeCoverDto): Promise<void> {
    if (id !== executor.id) {
      throw new ForbiddenException();
    }

    const user = await this.usersRepository.findById(id);

    if (user.coverPath) {
      await this.s3Service.remove(user.coverPath);
    }

    user.coverPath = path;

    await this.usersRepository.update(user.plain);
  }
}
