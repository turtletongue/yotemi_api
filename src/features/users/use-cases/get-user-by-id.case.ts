import { Injectable } from '@nestjs/common';

import { S3Service } from '@common/s3';
import { Id } from '@app/app.declarations';
import UsersRepository from '../users.repository';
import { PlainUser } from '../entities';

@Injectable()
export default class GetUserByIdCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly s3Service: S3Service,
  ) {}

  public async apply(id: Id): Promise<Omit<PlainUser, 'isBlocked'>> {
    return await this.usersRepository.findById(id).then(({ plain }) => ({
      id: plain.id,
      username: plain.username,
      accountAddress: plain.accountAddress,
      authId: plain.authId,
      firstName: plain.firstName,
      lastName: plain.lastName,
      fullName: plain.fullName,
      biography: plain.biography,
      avatarPath:
        plain.avatarPath && this.s3Service.getReadPath(plain.avatarPath),
      coverPath: plain.coverPath && this.s3Service.getReadPath(plain.coverPath),
      isVerified: plain.isVerified,
      topics: plain.topics,
      followersCount: plain.followersCount,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    }));
  }
}
