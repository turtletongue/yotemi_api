import { Id } from '@app/app.declarations';
import PlainTopic from './interfaces/plain-topic';
import TopicLabel from './interfaces/topic-label.interface';

export default class TopicEntity {
  constructor(
    public id: Id,
    public labels: TopicLabel[],
    public colorHex: string,
    public isModerated: boolean,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  public get plain(): PlainTopic {
    return {
      id: this.id,
      labels: this.labels,
      colorHex: this.colorHex,
      isModerated: this.isModerated,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
