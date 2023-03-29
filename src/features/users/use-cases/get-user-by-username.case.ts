import { Injectable } from '@nestjs/common';

import { S3Service } from '@common/s3';
import UsersRepository from '../users.repository';
import { PlainUser, UserEntity } from '../entities';

@Injectable()
export default class GetUserByUsernameCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly s3Service: S3Service,
  ) {}

  public async apply(
    username: string,
    executor?: UserEntity,
  ): Promise<PlainUser> {
    return await this.usersRepository
      .findByUsername(username, executor?.id)
      .then(({ plain }) => ({
        ...plain,
        avatarPath:
          plain.avatarPath && this.s3Service.getReadPath(plain.avatarPath),
        coverPath:
          plain.coverPath && this.s3Service.getReadPath(plain.coverPath),
      }));
  }
}
