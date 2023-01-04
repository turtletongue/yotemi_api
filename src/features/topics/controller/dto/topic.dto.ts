import { IsHexColor, IsNotEmpty } from 'class-validator';

export default class TopicDto {
  /**
   * Hex color for topic badge background.
   * @example '000000'
   */
  @IsHexColor()
  @IsNotEmpty()
  public colorHex: string;
}
