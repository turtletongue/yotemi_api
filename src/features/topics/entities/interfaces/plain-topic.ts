import { Id } from '@app/app.declarations';
import TopicLabel from './topic-label.interface';

export default interface PlainTopic {
  id: Id;
  labels: TopicLabel[];
  colorHex: string;
  createdAt: Date;
  updatedAt: Date;
}
