import { InterviewStatus } from '@prisma/client';

import { Id } from '@app/app.declarations';

export default class FindInterviewsDto {
  public creatorId: Id;
  public from: Date;
  public to: Date;
  public status?: InterviewStatus;
}
