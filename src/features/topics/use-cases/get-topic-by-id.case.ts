import { Injectable } from '@nestjs/common';

import { Id } from '@app/app.declarations';
import TopicsRepository from '../topics.repository';
import { PlainTopic } from '../entities';

@Injectable()
export default class GetTopicByIdCase {
  constructor(private readonly topicsRepository: TopicsRepository) {}

  public async apply(id: Id): Promise<PlainTopic> {
    const { plain } = await this.topicsRepository.findById(id);

    return {
      id: plain.id,
      labels: plain.labels,
      colorHex: plain.colorHex,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    };
  }
}
