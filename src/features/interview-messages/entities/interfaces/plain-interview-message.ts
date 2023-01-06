import { Id } from '@app/app.declarations';

export default interface PlainInterviewMessage {
  id: Id;
  content: string;
  authorId: Id | null;
  interviewId: Id;
  createdAt: Date;
  updatedAt: Date;
}
