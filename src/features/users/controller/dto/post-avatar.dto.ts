import { IsNotEmpty, IsString } from 'class-validator';

export default class PostAvatarDto {
  @IsString()
  @IsNotEmpty()
  public path: string;
}
