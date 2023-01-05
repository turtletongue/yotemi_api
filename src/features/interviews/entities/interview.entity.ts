import { InterviewStatus } from '@prisma/client';

import { UserEntity } from '@features/users/entities';
import { Id } from '@app/app.declarations';
import PlainInterview from './interfaces/plain-interview';

export default class InterviewEntity {
  constructor(
    private readonly id: Id,
    private readonly price: number,
    private readonly date: Date,
    private readonly status: InterviewStatus,
    private readonly creatorId: Id,
    private readonly participant: UserEntity | null,
    private readonly payerComment: string | null,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {}

  public getId(): Id {
    return this.id;
  }

  public getPrice(): number {
    return this.price;
  }

  public getDate(): Date {
    return this.date;
  }

  public getStatus(): InterviewStatus {
    return this.status;
  }

  public getCreatorId(): Id {
    return this.creatorId;
  }

  public getParticipant(): UserEntity | null {
    return this.participant;
  }

  public getPayerComment(): string {
    return this.payerComment;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public getPlain(): PlainInterview {
    return {
      id: this.id,
      price: this.price,
      date: this.date,
      status: this.status,
      creatorId: this.creatorId,
      participant: this.participant?.getPlain() ?? null,
      payerComment: this.payerComment,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
