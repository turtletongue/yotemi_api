import { Id } from '@app/app.declarations';
import PlainTopic from './interfaces/plain-topic';
import TopicLabel from './interfaces/topic-label.interface';

export default class TopicEntity {
  constructor(
    private readonly id: Id,
    private readonly labels: TopicLabel[],
    private readonly colorHex: string,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {}

  public getId(): Id {
    return this.id;
  }

  public getLabels(): TopicLabel[] {
    return this.labels;
  }

  public getColorHex(): string {
    return this.colorHex;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public getPlain(): PlainTopic {
    return {
      id: this.id,
      labels: this.labels,
      colorHex: this.colorHex,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
