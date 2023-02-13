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
    const {
      _count: { followers },
      ...user
    } = await this.prisma.user
      .findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          topics: includeTopicsOptions,
          _count: {
            select: {
              followers: true,
            },
          },
        },
      })
      .catch(() => {
        throw new UserNotFoundException();
      });

    return await this.userFactory.build({
      ...user,
      followersCount: followers,
    });
  }

  public async findByAccountAddress(address: string): Promise<UserEntity> {
    const {
      _count: { followers },
      ...user
    } = await this.prisma.user
      .findUniqueOrThrow({
        where: {
          accountAddress: address,
        },
        include: {
          topics: includeTopicsOptions,
          _count: {
            select: {
              followers: true,
            },
          },
        },
      })
      .catch(() => {
        throw new UserNotFoundException();
      });

    return await this.userFactory.build({
      ...user,
      followersCount: followers,
    });
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
    const paginated = await this.pagination.paginate<
      BuildUserDto & { _count: { followers: number } }
    >(this.prisma.user, page, limit, {
      ...options,
      include: {
        topics: includeTopicsOptions,
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });

    return {
      ...paginated,
      items: await Promise.all(
        paginated.items.map(
          async ({ _count: { followers }, ...user }) =>
            await this.userFactory.build({
              ...user,
              followersCount: followers,
            }),
        ),
      ),
    };
  }

  public async create(user: PlainUser): Promise<UserEntity> {
    const { topics, ...data } = user;

    const result = await this.prisma.user.create({
      data: {
        id: data.id,
        accountAddress: data.accountAddress,
        authId: data.authId,
        fullName: data.fullName,
        biography: data.biography,
        isVerified: data.isVerified,
        topics: {
          connect: topics.map((topic) => ({
            id: topic.id,
          })),
        },
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });

    return await this.userFactory.build(result);
  }

  public async update(
    user: Partial<PlainUser> & Pick<PlainUser, 'id'>,
  ): Promise<UserEntity> {
    const existingUser = await this.findById(user.id);

    const { topics, ...data } = user;

    const {
      _count: { followers },
      ...result
    } = await this.prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        id: data.id,
        accountAddress: data.accountAddress,
        authId: data.authId,
        fullName: data.fullName,
        biography: data.biography,
        isVerified: data.isVerified,
        topics: {
          set: [],
          connect: topics.map((topic) => ({ id: topic.id })),
        },
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      include: {
        topics: includeTopicsOptions,
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });

    return await this.userFactory.build({
      ...result,
      followersCount: followers,
    });
  }

  public async follow(followingId: Id, followerId: Id): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: followerId,
      },
      data: {
        following: {
          connect: { id: followingId },
        },
      },
    });
  }

  public async isFollowing(followingId: Id, followerId: Id): Promise<boolean> {
    const following = await this.findById(followingId);
    const follower = await this.findById(followerId);

    const user = await this.prisma.user.findFirst({
      where: {
        id: follower.id,
        following: {
          some: {
            id: following.id,
          },
        },
      },
    });

    return !!user;
  }

  public async unfollow(followingId: Id, followerId: Id): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: followerId,
      },
      data: {
        following: {
          disconnect: { id: followingId },
        },
      },
    });
  }

  public async delete(id: Id): Promise<UserEntity> {
    const existingUser = await this.findById(id);

    const {
      _count: { followers },
      ...result
    } = await this.prisma.user.delete({
      where: {
        id: existingUser.id,
      },
      include: {
        topics: includeTopicsOptions,
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });

    return await this.userFactory.build({
      ...result,
      followersCount: followers,
    });
  }
}
