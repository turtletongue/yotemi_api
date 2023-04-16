import { Injectable } from '@nestjs/common';

import { PaginationResult } from '@common/pagination';
import { Id } from '@app/app.declarations';
import FindTopicsDto from './dto/find-topics.dto';
import TopicsRepository from '../topics.repository';
import { PlainTopic } from '../entities';

interface FindOptions {
  where: {
    labels?: {
      some: {
        value: {
          contains: string;
          mode: 'insensitive';
        };
      };
    };
    isModerated?: boolean;
    id?: Id | { not: Id };
    OR?: FindOptions['where'][];
  };
}

@Injectable()
export default class FindTopicsCase {
  constructor(private readonly topicsRepository: TopicsRepository) {}

  public async apply(
    dto: FindTopicsDto,
  ): Promise<PaginationResult<PlainTopic>> {
    const findOptions: FindOptions = { where: {} };

    if (dto.label) {
      findOptions.where.labels = {
        some: {
          value: {
            contains: dto.label,
            mode: 'insensitive',
          },
        },
      };
    }

    if (dto.isModerated !== undefined) {
      if (dto.executor && dto.executor.kind === 'user') {
        findOptions.where.OR = [
          { isModerated: dto.isModerated },
          { id: { not: dto.executor.id } },
        ];
      } else {
        findOptions.where.isModerated = dto.isModerated;
      }
    }

    const result = await this.topicsRepository.findPaginated(
      dto.page,
      dto.pageSize,
      findOptions,
    );

    return {
      ...result,
      items: result.items.map(({ plain }) => ({
        id: plain.id,
        labels: plain.labels,
        colorHex: plain.colorHex,
        isModerated: plain.isModerated,
        createdAt: plain.createdAt,
        updatedAt: plain.updatedAt,
      })),
    };
  }
}
