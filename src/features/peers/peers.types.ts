import { Id } from '@app/app.declarations';

export type GeneratePeerResponse = {
  peerId: string;
  otherPeerId: string;
  otherHasAudio: boolean;
  otherHasVideo: boolean;
  interviewId: Id;
};
