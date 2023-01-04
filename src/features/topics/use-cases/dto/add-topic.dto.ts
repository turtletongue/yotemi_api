import { Language } from '@prisma/client';

export default class AddTopicDto {
  public labels: {
    value: string;
    language: Language;
  }[];
  public colorHex: string;
}
