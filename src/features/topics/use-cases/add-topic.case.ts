import { Injectable } from '@nestjs/common';

import TopicsRepository from '../topics.repository';
import AddTopicDto from './dto/add-topic.dto';
import { PlainTopic, TopicFactory } from '../entities';
import { NotUniqueLabelLanguageException } from '../exceptions';

@Injectable()
export default class AddTopicCase {
  constructor(
    private readonly topicsRepository: TopicsRepository,
    private readonly topicFactory: TopicFactory,
  ) {}

  public async apply(dto: AddTopicDto): Promise<PlainTopic> {
    const labelsLanguages = dto.labels.map((label) => label.language);
    const isLabelLanguagesUnique =
      labelsLanguages.length === new Set(labelsLanguages).size;

    if (!isLabelLanguagesUnique) {
      throw new NotUniqueLabelLanguageException();
    }

    const topic = await this.topicFactory.build(dto);

    const { plain } = await this.topicsRepository.create(topic.plain);

    return {
      id: plain.id,
      labels: plain.labels,
      colorHex: plain.colorHex,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    };
  }
}
