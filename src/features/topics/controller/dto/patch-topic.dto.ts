import { ApiHideProperty, PartialType } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Language } from '@prisma/client';
import { Type } from 'class-transformer';

import { Id } from '@app/app.declarations';
import TopicDto from './topic.dto';

class PatchTopicLabelDto {
  /**
   * Unique identifier of label.
   * @example '39b6694a-8b50-44bf-907f-46d371801370'
   */
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public id?: Id;

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

export default class PatchTopicDto extends PartialType(TopicDto) {
  @ApiHideProperty()
  public id: Id;

  /**
   * Array of labels in different languages.
   */
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => PatchTopicLabelDto)
  public labels: PatchTopicLabelDto[];

  /**
   * If true topic will be shown in the topics select for all users.
   */
  @IsBoolean()
  @IsOptional()
  public isModerated?: boolean;
}
