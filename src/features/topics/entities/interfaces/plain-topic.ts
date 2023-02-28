import { Id } from '@app/app.declarations';
import TopicLabel from './topic-label.interface';

export default interface PlainTopic {
  id: Id;
  labels: TopicLabel[];
  colorHex: string;
  isModerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}
