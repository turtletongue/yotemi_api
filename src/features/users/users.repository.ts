import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@common/prisma';
import { PaginationResult, PaginationService } from '@common/pagination';
import { Id } from '@app/app.declarations';
import { UserNotFoundException } from './exceptions';
import BuildUserDto from './entities/dto/build-user.dto';
import { PlainUser, UserEntity, UserFactory } from './entities';

const includeTopicsOptions = {
  include: {
    labels: {
      select: {
        id: true,
        value: true,
        language: true,
      },
    },
  },
};

@Injectable()
export default class UsersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pagination: PaginationService,
    private readonly userFactory: UserFactory,
  ) {}

  public async findById(id: Id): Promise<UserEntity> {
    const user = await this.prisma.user
      .findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          topics: includeTopicsOptions,
        },
      })
      .catch(() => {
        throw new UserNotFoundException();
      });

    return await this.userFactory.build(user);
  }

  public async findByAccountAddress(address: string): Promise<UserEntity> {
    const user = await this.prisma.user
      .findUniqueOrThrow({
        where: {
          accountAddress: address,
        },
        include: {
          topics: includeTopicsOptions,
        },
      })
      .catch(() => {
        throw new UserNotFoundException();
      });

    return await this.userFactory.build(user);
  }

  public async isAccountAddressTaken(address: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        accountAddress: address,
      },
    });

    return !!user;
  }

  public async findPaginated(
    page: number,
    limit: number,
    options?: Prisma.UserFindManyArgs,
  ): Promise<PaginationResult<UserEntity>> {
    const paginated = await this.pagination.paginate<BuildUserDto>(
      this.prisma.user,
      page,
      limit,
      {
        ...options,
        include: {
          topics: includeTopicsOptions,
        },
      },
    );

    return {
      ...paginated,
      items: await Promise.all(
        paginated.items.map(async (user) => await this.userFactory.build(user)),
      ),
    };
  }

  public async create(user: PlainUser): Promise<UserEntity> {
    const { topics, ...data } = user;

    const result = await this.prisma.user.create({
      data: {
        ...data,
        topics: {
          connect: topics.map((topic) => ({
            id: topic.id,
          })),
        },
      },
    });

    return await this.userFactory.build(result);
  }

  public async update(
    user: Partial<PlainUser> & Pick<PlainUser, 'id'>,
  ): Promise<UserEntity> {
    const existingUser = await this.findById(user.id);

    const { topics, ...data } = user;

    const result = await this.prisma.user.update({
      where: {
        id: existingUser.getId(),
      },
      data: {
        ...data,
        topics: {
          set: [],
          connect: topics.map((topic) => ({ id: topic.id })),
        },
      },
      include: {
        topics: includeTopicsOptions,
      },
    });

    return await this.userFactory.build(result);
  }

  public async delete(id: Id): Promise<UserEntity> {
    const existingUser = await this.findById(id);

    const result = await this.prisma.user.delete({
      where: {
        id: existingUser.getId(),
      },
      include: {
        topics: includeTopicsOptions,
      },
    });

    return await this.userFactory.build(result);
  }
}
