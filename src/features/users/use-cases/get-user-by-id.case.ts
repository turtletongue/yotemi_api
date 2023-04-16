import { Injectable } from '@nestjs/common';

import { S3Service } from '@common/s3';
import { AdminEntity } from '@features/admins/entities';
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
    executor?: AdminEntity | UserEntity,
  ): Promise<Omit<PlainUser, 'isBlocked'>> {
    return await this.usersRepository
      .findById(
        id,
        executor && executor.kind === 'user' ? executor.id : undefined,
      )
      .then(({ plain }) => ({
        ...plain,
        avatarPath:
          plain.avatarPath && this.s3Service.getReadPath(plain.avatarPath),
        coverPath:
          plain.coverPath && this.s3Service.getReadPath(plain.coverPath),
      }));
  }
}
