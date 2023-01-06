import { Id } from '@app/app.declarations';
import PlainInterviewMessage from './interfaces/plain-interview-message';

export default class InterviewMessageEntity {
  constructor(
    private _id: Id,
    private _content: string,
    private _authorId: Id | null,
    private _interviewId: Id,
    private _createdAt: Date,
    private _updatedAt: Date,
  ) {}

  public get id(): Id {
    return this._id;
  }

  public get content(): string {
    return this._content;
  }

  public get authorId(): Id | null {
    return this._authorId;
  }

  public get interviewId(): Id {
    return this._interviewId;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

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
