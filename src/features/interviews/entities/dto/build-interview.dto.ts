import BuildUserDto from '@features/users/entities/dto/build-user.dto';
import { Id } from '@app/app.declarations';

export default class BuildInterviewDto {
  public id?: Id;
  public address: string;
  public price: number;
  public startAt: Date;
  public endAt: Date;
  public creator?: BuildUserDto;
  public creatorId: Id;
  public creatorPeerId?: string;
  public participant?: BuildUserDto | null;
  public participantPeerId?: string;
  public payerComment?: string | null;
  public isDeployed?: boolean;
  public createdAt?: Date;
  public updatedAt?: Date;
}
