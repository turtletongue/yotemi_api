import { Injectable } from '@nestjs/common';

import { PaginationResult } from '@common/pagination';
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

    const result = await this.topicsRepository.findPaginated(
      dto.page,
      dto.pageSize,
      findOptions,
    );

    return {
      ...result,
      items: result.items.map((topic) => {
        const plain = topic.getPlain();

        return {
          id: plain.id,
          labels: plain.labels,
          colorHex: plain.colorHex,
          createdAt: plain.createdAt,
          updatedAt: plain.updatedAt,
        };
      }),
    };
  }
}
