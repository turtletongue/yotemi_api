import { Injectable } from '@nestjs/common';

import { IdentifiersService } from '@common/identifiers';
import BuildTopicDto from './dto/build-topic.dto';
import TopicEntity from './topic.entity';

@Injectable()
export default class TopicFactory {
  constructor(private readonly identifiers: IdentifiersService) {}

  public async build({
    id = this.identifiers.generate(),
    labels,
    colorHex,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: BuildTopicDto): Promise<TopicEntity> {
    return new TopicEntity(
      id,
      labels.map((label) => ({
        id: label.id ?? this.identifiers.generate(),
        value: label.value,
        language: label.language,
      })),
      colorHex,
      createdAt,
      updatedAt,
    );
  }
}
