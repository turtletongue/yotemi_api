import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@common/prisma';
import { PaginationResult, PaginationService } from '@common/pagination';
import { Id } from '@app/app.declarations';
import BuildUserDto from './entities/dto/build-user.dto';
import { PlainUser, UserEntity, UserFactory } from './entities';
import { UserNotFoundException } from './exceptions';

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

  public async findById(id: Id, followerId?: Id): Promise<UserEntity> {
    const {
      _count: { followers, reviews },
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
              reviews: {
                where: {
                  isModerated: true,
                },
              },
            },
          },
        },
      })
      .catch(() => {
        throw new UserNotFoundException();
      });

    const reviewsAverage = await this.getReviewsAverage(id);
    const [isFollowing] = await this.isFollowing([id], followerId);

    return await this.userFactory.build({
      ...user,
      followersCount: followers,
      reviewsCount: reviews,
      ...reviewsAverage,
      isFollowing,
    });
  }

  public async findByAccountAddress(
    address: string,
    followerId?: Id,
  ): Promise<UserEntity> {
    const {
      _count: { followers, reviews },
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
              reviews: {
                where: {
                  isModerated: true,
                },
              },
            },
          },
        },
      })
      .catch(() => {
        throw new UserNotFoundException();
      });

    const reviewsAverage = await this.getReviewsAverage(user.id);
    const [isFollowing] = await this.isFollowing([user.id], followerId);

    return await this.userFactory.build({
      ...user,
      followersCount: followers,
      reviewsCount: reviews,
      ...reviewsAverage,
      isFollowing,
    });
  }

  public async findByUsername(
    username: string,
    followerId?: Id,
  ): Promise<UserEntity> {
    const {
      _count: { followers, reviews },
      ...user
    } = await this.prisma.user
      .findUniqueOrThrow({
        where: {
          username,
        },
        include: {
          topics: includeTopicsOptions,
          _count: {
            select: {
              followers: true,
              reviews: {
                where: {
                  isModerated: true,
                },
              },
            },
          },
        },
      })
      .catch(() => {
        throw new UserNotFoundException();
      });

    const reviewsAverage = await this.getReviewsAverage(user.id);
    const [isFollowing] = await this.isFollowing([user.id], followerId);

    return await this.userFactory.build({
      ...user,
      followersCount: followers,
      reviewsCount: reviews,
      ...reviewsAverage,
      isFollowing,
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

  public async isUsernameTaken(
    username: string,
    selfId?: Id,
  ): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        username,
        ...(selfId && {
          id: {
            not: selfId,
          },
        }),
      },
    });

    return !!user;
  }

  public async findPaginated(
    page: number,
    limit: number,
    options?: Prisma.UserInfoFindManyArgs,
    followerId?: Id,
  ): Promise<PaginationResult<UserEntity>> {
    const paginated = await this.pagination.paginate<BuildUserDto>(
      this.prisma.userInfo,
      page,
      limit,
      options,
    );

    const usersIds = paginated.items.map(({ id }) => id);
    const isFollowingChecks = await this.isFollowing(usersIds, followerId);

    const topics = await this.prisma.topic.findMany({
      where: {
        users: {
          some: {
            id: {
              in: usersIds,
            },
          },
        },
      },
      include: {
        labels: true,
        users: {
          where: {
            id: {
              in: usersIds,
            },
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      ...paginated,
      items: await this.userFactory.buildMany(
        paginated.items.map((user, index) => ({
          ...user,
          topics: topics.filter(
            (topic) => !!topic.users.find(({ id }) => id === user.id),
          ),
          isFollowing: isFollowingChecks[index],
        })),
      ),
    };
  }

  public async findFollowingIds(id: Id): Promise<Id[]> {
    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        followerId: id,
      },
      select: {
        followingId: true,
      },
    });

    return subscriptions.map(({ followingId }) => followingId);
  }

  public async create(user: PlainUser): Promise<UserEntity> {
    const { topics, ...data } = user;

    const result = await this.prisma.user.create({
      data: {
        id: data.id,
        username: data.username,
        accountAddress: data.accountAddress,
        authId: data.authId,
        firstName: data.firstName,
        lastName: data.lastName,
        biography: data.biography,
        isVerified: data.isVerified,
        topics: {
          connect: topics.map((topic) => ({
            id: topic.id,
          })),
        },
        isBlocked: data.isBlocked,
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
      _count: { followers, reviews },
      ...result
    } = await this.prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        id: data.id,
        username: data.username,
        accountAddress: data.accountAddress,
        authId: data.authId,
        firstName: data.firstName,
        lastName: data.lastName,
        biography: data.biography,
        avatarPath: data.avatarPath,
        coverPath: data.coverPath,
        isVerified: data.isVerified,
        topics: {
          set: [],
          connect: topics.map((topic) => ({ id: topic.id })),
        },
        isBlocked: data.isBlocked,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      include: {
        topics: includeTopicsOptions,
        _count: {
          select: {
            followers: true,
            reviews: {
              where: {
                isModerated: true,
              },
            },
          },
        },
      },
    });

    return await this.userFactory.build({
      ...result,
      followersCount: followers,
      reviewsCount: reviews,
    });
  }

  public async follow(followingId: Id, followerId: Id): Promise<void> {
    await this.prisma.$transaction(async (prisma) => {
      const existingSubscription = await prisma.subscription.findFirst({
        where: {
          followerId,
          followingId,
        },
      });

      if (existingSubscription) {
        return;
      }

      await prisma.subscription.create({
        data: {
          followerId,
          followingId,
        },
      });
    });
  }

  public async isFollowing(
    followingIds: Id[],
    followerId?: Id,
  ): Promise<boolean[]> {
    if (!followerId) {
      return new Array(followingIds.length).fill(false);
    }

    const follower = await this.findById(followerId);

    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        followingId: {
          in: followingIds,
        },
        followerId: follower.id,
      },
    });

    const followingIdToSubscription = subscriptions.reduce(
      (map, current) => ({ ...map, [current.followingId]: current }),
      {},
    );

    return followingIds.map(
      (followingId) => !!followingIdToSubscription[followingId],
    );
  }

  public async unfollow(followingId: Id, followerId: Id): Promise<void> {
    await this.prisma.subscription.deleteMany({
      where: {
        followingId,
        followerId,
      },
    });
  }

  public async delete(id: Id): Promise<UserEntity> {
    const existingUser = await this.findById(id);

    const {
      _count: { followers, reviews },
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
            reviews: {
              where: {
                isModerated: true,
              },
            },
          },
        },
      },
    });

    return await this.userFactory.build({
      ...result,
      followersCount: followers,
      reviewsCount: reviews,
    });
  }

  private async getReviewsAverage(
    id: Id,
  ): Promise<{ averagePoints: number; reviewsCount: number }> {
    const {
      _avg: { points: averagePoints },
      _count: { id: reviewsCount },
    } = await this.prisma.review.aggregate({
      where: {
        userId: id,
        isModerated: true,
      },
      _avg: {
        points: true,
      },
      _count: {
        id: true,
      },
    });

    return {
      averagePoints: averagePoints ?? 0,
      reviewsCount: reviewsCount ?? 0,
    };
  }
}
