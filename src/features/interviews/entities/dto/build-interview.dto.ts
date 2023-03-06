import BuildUserDto from '@features/users/entities/dto/build-user.dto';
import { Id } from '@app/app.declarations';

export default class BuildInterviewDto {
  public id?: Id;
  public address: string;
  public price: number;
  public startAt: Date;
  public endAt: Date;
  public creatorId: Id;
  public participant?: BuildUserDto | null;
  public payerComment?: string | null;
  public createdAt?: Date;
  public updatedAt?: Date;
}
