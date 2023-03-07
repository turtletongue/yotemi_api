import { Injectable, UnauthorizedException } from '@nestjs/common';

import { S3Service } from '@common/s3';
import ChangeAvatarDto from './dto/change-avatar.dto';
import UsersRepository from '../users.repository';

@Injectable()
export default class ChangeAvatarCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly s3Service: S3Service,
  ) {}

  public async apply({ id, path, executor }: ChangeAvatarDto): Promise<void> {
    if (id !== executor.id) {
      throw new UnauthorizedException();
    }

    const user = await this.usersRepository.findById(id);

    if (user.avatarPath) {
      await this.s3Service.remove(user.avatarPath);
    }

    user.avatarPath = path;

    await this.usersRepository.update(user.plain);
  }
}
