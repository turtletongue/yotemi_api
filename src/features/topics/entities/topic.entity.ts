import { Id } from '@app/app.declarations';
import PlainTopic from './interfaces/plain-topic';
import TopicLabel from './interfaces/topic-label.interface';

export default class TopicEntity {
  constructor(
    private _id: Id,
    private _labels: TopicLabel[],
    private _colorHex: string,
    private _createdAt: Date,
    private _updatedAt: Date,
  ) {}

  public get id(): Id {
    return this._id;
  }

  public get labels(): TopicLabel[] {
    return this._labels;
  }

  public get colorHex(): string {
    return this._colorHex;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public get plain(): PlainTopic {
    return {
      id: this.id,
      labels: this.labels,
      colorHex: this.colorHex,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
