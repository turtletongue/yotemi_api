import BuildUserDto from '@features/users/entities/dto/build-user.dto';
import { Id } from '@app/app.declarations';

export default class BuildReviewDto {
  public id?: Id;
  public points: number;
  public comment: string;
  public userId: Id;
  public reviewer: BuildUserDto;
  public createdAt?: Date;
  public updatedAt?: Date;
}
