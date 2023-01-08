import { InterviewStatus } from '@prisma/client';

import { PlainUser } from '@features/users/entities';
import { Id } from '@app/app.declarations';

export default interface PlainInterview {
  id: Id;
  price: number;
  startAt: Date;
  endAt: Date;
  status: InterviewStatus;
  creatorId: Id;
  participant: PlainUser | null;
  payerComment: string | null;
  createdAt: Date;
  updatedAt: Date;
}
