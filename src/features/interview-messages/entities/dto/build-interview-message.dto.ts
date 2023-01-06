import { Id } from '@app/app.declarations';

export default class BuildInterviewMessageDto {
  public id?: Id;
  public content: string;
  public authorId?: Id | null;
  public interviewId: Id;
  public createdAt?: Date;
  public updatedAt?: Date;
}
