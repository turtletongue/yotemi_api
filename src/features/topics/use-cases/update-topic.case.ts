import { Injectable } from '@nestjs/common';

import UpdateTopicDto from './dto/update-topic.dto';
import TopicsRepository from '../topics.repository';
import { PlainTopic, TopicFactory } from '../entities';
import { NotUniqueLabelLanguageException } from '../exceptions';

@Injectable()
export default class UpdateTopicCase {
  constructor(
    private readonly topicsRepository: TopicsRepository,
    private readonly topicFactory: TopicFactory,
  ) {}

  public async apply(dto: UpdateTopicDto): Promise<PlainTopic> {
    const labelsLanguages = dto.labels.map((label) => label.language);
    const isLabelLanguagesUnique =
      labelsLanguages.length === new Set(labelsLanguages).size;

    if (!isLabelLanguagesUnique) {
      throw new NotUniqueLabelLanguageException();
    }

    const existingProperties = await this.topicsRepository.findById(dto.id);
    const topic = await this.topicFactory.build({
      ...existingProperties.plain,
      ...dto,
    });

    const { plain } = await this.topicsRepository.update(topic.plain);

    return {
      id: plain.id,
      labels: plain.labels,
      colorHex: plain.colorHex,
      isModerated: plain.isModerated,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    };
  }
}
