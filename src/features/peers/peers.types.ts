import { Id } from '@app/app.declarations';

export type GeneratePeerResponse = {
  otherHasAudio: boolean;
  otherHasVideo: boolean;
  interviewId: Id;
};
