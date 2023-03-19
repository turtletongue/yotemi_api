import { Injectable } from '@nestjs/common';

import { PaginationResult } from '@common/pagination';
import { S3Service } from '@common/s3';
import FindUsersDto from './dto/find-users.dto';
import UsersRepository from '../users.repository';
import { PlainUser } from '../entities';

interface FindOptions {
  where: {
    accountAddress?: string | { not: string };
    isBlocked: boolean;
  };
}

@Injectable()
export default class FindUsersCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly s3Service: S3Service,
  ) {}

  public async apply(
    dto: FindUsersDto,
  ): Promise<PaginationResult<Omit<PlainUser, 'isBlocked'>>> {
    const findOptions: FindOptions = {
      where: {
        isBlocked:
          !dto.executor || dto.executor.kind === 'user' ? false : undefined,
      },
    };

    if (dto.executor && dto.executor.kind === 'user' && dto.hideSelf) {
      findOptions.where.accountAddress = {
        not: dto.executor.accountAddress,
      };
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
