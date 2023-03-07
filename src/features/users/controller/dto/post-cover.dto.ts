import { IsNotEmpty, IsString } from 'class-validator';

export default class PostCoverDto {
  @IsString()
  @IsNotEmpty()
  public path: string;
}
