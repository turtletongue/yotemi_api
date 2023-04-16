import { Injectable } from '@nestjs/common';

import { PaginationResult } from '@common/pagination';
import { S3Service } from '@common/s3';
import FindUsersDto from './dto/find-users.dto';
import UsersRepository from '../users.repository';
import { PlainUser } from '../entities';

@Injectable()
export default class FindUsersCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly s3Service: S3Service,
  ) {}

  public async apply(
    dto: FindUsersDto,
  ): Promise<PaginationResult<Omit<PlainUser, 'isBlocked'>>> {
    let showBlocked: boolean | undefined = undefined;

    if (dto.executor) {
      showBlocked = dto.executor.kind === 'user' ? false : dto.isBlocked;
    }

    const result = await this.usersRepository.findPaginated(
      dto.page,
      dto.pageSize,
      {
        where: {
          isBlocked: showBlocked,
          ...(dto.isOnlyFull && {
            biography: {
              not: '',
            },
            topics: {
              some: {},
            },
          }),
          ...(dto.topicIds &&
            dto.topicIds.length > 0 && {
              topics: {
                some: {
                  id: {
                    in: dto.topicIds,
                  },
                },
              },
            }),
          ...(dto.search && {
            OR: [
              {
                username: {
                  contains: dto.search,
                  mode: 'insensitive',
                },
              },
              {
                biography: {
                  contains: dto.search,
                  mode: 'insensitive',
                },
              },
            ],
          }),
          ...(dto.executor &&
            dto.executor.kind === 'user' &&
            dto.hideSelf && {
              accountAddress: {
                not: dto.executor.accountAddress,
              },
            }),
        },
        orderBy: {
          ...(dto.orderBy === 'rating' && {
            reviews: {
              _count: 'desc',
            },
          }),
          ...(dto.orderBy === 'activity' && {
            interviews: {
              _count: 'desc',
            },
          }),
        },
      },
      dto.executor && dto.executor.kind === 'user'
        ? dto.executor.id
        : undefined,
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
