import { Language } from '@prisma/client';

import { Id } from '@app/app.declarations';

export default class UpdateTopicDto {
  public id: Id;
  public labels?: {
    id?: Id;
    value: string;
    language: Language;
  }[];
  public colorHex?: string;
}
