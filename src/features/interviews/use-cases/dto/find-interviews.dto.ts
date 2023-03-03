import { Id } from '@app/app.declarations';
import { InterviewStatus } from '../../interviews.types';

export default class FindInterviewsDto {
  public creatorId: Id;
  public from: Date;
  public to: Date;
  public status?: InterviewStatus;
  public isDeployed?: boolean;
}
