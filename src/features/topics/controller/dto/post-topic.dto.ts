import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Language } from '@prisma/client';

import TopicDto from './topic.dto';

class PostTopicLabelDto {
  /**
   * A label for the topic in the given language.
   * @example 'Computer Science'
   */
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  public value: string;

  /**
   * A language for the label.
   * @example 'en'
   */
  @IsEnum(Language)
  public language: Language;
}

export default class PostTopicDto extends TopicDto {
  /**
   * Array of labels in different languages.
   */
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => PostTopicLabelDto)
  public labels: PostTopicLabelDto[];
}
