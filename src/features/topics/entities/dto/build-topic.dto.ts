import { Language } from '@prisma/client';

import { Id } from '@app/app.declarations';

export default class BuildTopicDto {
  public id?: Id;
  public labels: {
    id?: Id;
    value: string;
    language: Language;
  }[];
  public colorHex: string;
  public isModerated: boolean;
  public createdAt?: Date;
  public updatedAt?: Date;
}
