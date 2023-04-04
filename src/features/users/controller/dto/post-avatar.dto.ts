import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class PostAvatarDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public path: string | null;
}
