import { Id } from '@app/app.declarations';
import PlainInterviewMessage from './interfaces/plain-interview-message';

export default class InterviewMessageEntity {
  constructor(
    public id: Id,
    public content: string,
    public authorId: Id | null,
    public interviewId: Id,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  public get plain(): PlainInterviewMessage {
    return {
      id: this.id,
      content: this.content,
      authorId: this.authorId,
      interviewId: this.interviewId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
