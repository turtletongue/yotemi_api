import { Injectable } from '@nestjs/common';

import { S3Service } from '@common/s3';
import { Id } from '@app/app.declarations';
import UsersRepository from '../users.repository';
import { UserEntity, PlainUser } from '../entities';

@Injectable()
export default class GetUserByIdCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly s3Service: S3Service,
  ) {}

  public async apply(
    id: Id,
    executor?: UserEntity,
  ): Promise<Omit<PlainUser, 'isBlocked'>> {
    return await this.usersRepository
      .findById(id, executor?.id)
      .then(({ plain }) => ({
        ...plain,
        avatarPath:
          plain.avatarPath && this.s3Service.getReadPath(plain.avatarPath),
        coverPath:
          plain.coverPath && this.s3Service.getReadPath(plain.coverPath),
      }));
  }
}
