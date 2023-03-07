import { Injectable } from '@nestjs/common';

import { PaginationResult } from '@common/pagination';
import { S3Service } from '@common/s3';
import FindUsersDto from './dto/find-users.dto';
import UsersRepository from '../users.repository';
import { PlainUser } from '../entities';

interface FindOptions {
  where: {
    accountAddress?: string;
  };
}

@Injectable()
export default class FindUsersCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly s3Service: S3Service,
  ) {}

  public async apply(dto: FindUsersDto): Promise<PaginationResult<PlainUser>> {
    const findOptions: FindOptions = { where: {} };

    if (dto.accountAddress) {
      findOptions.where.accountAddress = dto.accountAddress;
    }

    const result = await this.usersRepository.findPaginated(
      dto.page,
      dto.pageSize,
      findOptions,
    );

    return {
      ...result,
      items: result.items.map(({ plain }) => ({
        ...plain,
        avatarPath:
          plain.avatarPath && this.s3Service.getReadPath(plain.avatarPath),
        coverPath:
          plain.coverPath && this.s3Service.getReadPath(plain.coverPath),
      })),
    };
  }
}
