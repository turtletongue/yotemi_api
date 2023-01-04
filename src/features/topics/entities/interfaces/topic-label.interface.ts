import { Language } from '@prisma/client';
import { Id } from '@app/app.declarations';

export default interface TopicLabel {
  id: Id;
  value: string;
  language: Language;
}
