import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@common/prisma';
import { PaginationService, PaginationResult } from '@common/pagination';
import { Id } from '@app/app.declarations';
import BuildAdminDto from './entities/dto/build-admin.dto';
import { AdminEntity, AdminFactory, PlainAdmin } from './entities';
import { AdminNotFoundException } from './exceptions';

@Injectable()
export default class AdminsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pagination: PaginationService,
    private readonly adminFactory: AdminFactory,
  ) {}

  public async findById(id: Id): Promise<AdminEntity> {
    const admin = await this.prisma.admin
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .catch(() => {
        throw new AdminNotFoundException();
      });

    return await this.adminFactory.build({
      ...admin,
      passwordHash: admin.password,
    });
  }

  public async findByUsername(username: string): Promise<AdminEntity> {
    const admin = await this.prisma.admin
      .findUniqueOrThrow({
        where: {
          username,
        },
      })
      .catch(() => {
        throw new AdminNotFoundException();
      });

    return await this.adminFactory.build({
      ...admin,
      passwordHash: admin.password,
    });
  }

  public async isUsernameTaken(username: string): Promise<boolean> {
    const admin = await this.prisma.admin.findFirst({
      where: {
        username,
      },
    });

    return !!admin;
  }

  public async findPaginated(
    page: number,
    limit: number,
    options?: Prisma.AdminFindManyArgs,
  ): Promise<PaginationResult<AdminEntity>> {
    const paginated = await this.pagination.paginate<BuildAdminDto>(
      this.prisma.admin,
      page,
      limit,
      options,
    );

    return {
      ...paginated,
      items: await Promise.all(
        paginated.items.map(
          async (admin) =>
            await this.adminFactory.build({
              ...admin,
              passwordHash: admin.password,
            }),
        ),
      ),
    };
  }

  public async create(admin: PlainAdmin): Promise<AdminEntity> {
    const result = await this.prisma.admin.create({
      data: admin,
    });

    return await this.adminFactory.build({
      ...result,
      passwordHash: result.password,
    });
  }

  public async update(
    admin: Partial<PlainAdmin> & Pick<PlainAdmin, 'id'>,
  ): Promise<AdminEntity> {
    const existingAdmin = await this.findById(admin.id);

    const result = await this.prisma.admin.update({
      where: {
        id: existingAdmin.id,
      },
      data: admin,
    });

    return await this.adminFactory.build({
      ...result,
      passwordHash: result.password,
    });
  }

  public async delete(id: Id): Promise<AdminEntity> {
    const existingAdmin = await this.findById(id);

    const result = await this.prisma.admin.delete({
      where: {
        id: existingAdmin.id,
      },
    });

    return await this.adminFactory.build({
      ...result,
      passwordHash: result.password,
    });
  }
}
