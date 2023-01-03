import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@common/prisma';
import { PaginationResult, PaginationService } from '@common/pagination';
import { Id } from '@app/app.declarations';
import { UserNotFoundException } from './exceptions';
import BuildUserDto from './entities/dto/build-user.dto';
import { PlainUser, UserEntity, UserFactory } from './entities';

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
      options,
    );

    return {
      ...paginated,
      items: await Promise.all(
        paginated.items.map(async (user) => await this.userFactory.build(user)),
      ),
    };
  }

  public async create(user: PlainUser): Promise<UserEntity> {
    const result = await this.prisma.user.create({
      data: user,
    });

    return await this.userFactory.build(result);
  }

  public async update(
    user: Partial<PlainUser> & Pick<PlainUser, 'id'>,
  ): Promise<UserEntity> {
    const existingUser = await this.findById(user.id);

    const result = await this.prisma.user.update({
      where: {
        id: existingUser.getId(),
      },
      data: user,
    });

    return await this.userFactory.build(result);
  }

  public async delete(id: Id): Promise<UserEntity> {
    const existingUser = await this.findById(id);

    const result = await this.prisma.user.delete({
      where: {
        id: existingUser.getId(),
      },
    });

    return await this.userFactory.build(result);
  }
}
