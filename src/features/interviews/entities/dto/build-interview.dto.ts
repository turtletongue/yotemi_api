import { InterviewStatus } from '@prisma/client';

import BuildUserDto from '@features/users/entities/dto/build-user.dto';
import { Id } from '@app/app.declarations';

export default class BuildInterviewDto {
  public id?: Id;
  public price: number;
  public startAt: Date;
  public endAt: Date;
  public status?: InterviewStatus;
  public creatorId: Id;
  public participant?: BuildUserDto | null;
  public payerComment?: string | null;
  public createdAt?: Date;
  public updatedAt?: Date;
}
