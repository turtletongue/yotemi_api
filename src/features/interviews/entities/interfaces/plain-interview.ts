import { PlainUser } from '@features/users/entities';
import { Id } from '@app/app.declarations';
import { InterviewStatus } from '../../interviews.types';

export default interface PlainInterview {
  id: Id;
  address: string;
  price: number;
  startAt: Date;
  endAt: Date;
  status: InterviewStatus;
  creatorId: Id;
  participant: PlainUser | null;
  payerComment: string | null;
  isDeployed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
