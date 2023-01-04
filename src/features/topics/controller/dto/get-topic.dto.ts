import { Language } from '@prisma/client';

import { Id } from '@app/app.declarations';
import TopicDto from './topic.dto';

class GetTopicLabelDto {
  /**
   * Unique identifier of label.
   * @example '39b6694a-8b50-44bf-907f-46d371801370'
   */
  public id: Id;

  /**
   * A label for the topic in the given language.
   * @example 'Computer Science'
   */
  public value: string;

  /**
   * A language for the label.
   * @example 'en'
   */
  public language: Language;
}

export default class GetTopicDto extends TopicDto {
  /**
   * Unique identifier of topic.
   * @example '2f5d7d80-fa49-49c1-9099-c22a2019a700'
   */
  public id: Id;

  /**
   * Array of labels in different languages.
   */
  public labels: GetTopicLabelDto[];

  /**
   * Date and time of topic creation.
   * @example '2022-07-25T00:00:00.000Z'
   */
  public createdAt: Date;

  /**
   * Date and time of last topic update.
   * @example '2022-07-25T00:00:00.000Z'
   */
  public updatedAt: Date;
}
