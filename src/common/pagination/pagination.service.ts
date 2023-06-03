import { Injectable } from '@nestjs/common';

import { PrismaService } from '@common/prisma';
import { Model } from '@app/app.declarations';
import PaginatedDto from './paginated.dto';

@Injectable()
export default class PaginationService {
  constructor(private readonly prisma: PrismaService) {}

  public async paginate<T extends Record<string, any>>(
    model: Pick<Model, 'findMany' | 'aggregate'>,
    page = 1,
    limit = 10,
    options?: any,
  ): Promise<InstanceType<ReturnType<typeof PaginatedDto<T>>>> {
    const skip = this.getSkipCount(page, limit);

    const [
      items,
      {
        _count: { id: count },
      },
    ] = await this.prisma.$transaction([
      (model as any).findMany({
        ...(options ?? {}),
        skip,
        take: limit,
      }),
      (model as any).aggregate({
        where: options?.where ?? {},
        _count: {
          id: true,
        },
      }),
    ]);

    return {
      page,
      pageSize: limit,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      items,
    };
  }

  private getSkipCount(page: number, limit: number): number {
    return page * limit - limit;
  }
}
