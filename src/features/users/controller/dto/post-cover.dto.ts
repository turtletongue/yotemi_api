import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class PostCoverDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public path: string | null;
}
