import { Injectable } from '@nestjs/common';

import DeleteTopicDto from './dto/delete-topic.dto';
import TopicsRepository from '../topics.repository';
import { PlainTopic } from '../entities';

@Injectable()
export default class DeleteTopicCase {
  constructor(private readonly topicsRepository: TopicsRepository) {}

  public async apply({ id }: DeleteTopicDto): Promise<PlainTopic> {
    const { plain } = await this.topicsRepository.delete(id);

    return {
      id: plain.id,
      labels: plain.labels,
      colorHex: plain.colorHex,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    };
  }
}
