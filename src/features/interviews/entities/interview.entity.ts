import { UserEntity } from '@features/users/entities';
import { Id } from '@app/app.declarations';
import PlainInterview from './interfaces/plain-interview';

export default class InterviewEntity {
  constructor(
    public id: Id,
    public address: string,
    public price: number,
    public startAt: Date,
    public endAt: Date,
    public creatorId: Id,
    public participant: UserEntity | null,
    public payerComment: string | null,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  public get plain(): PlainInterview {
    return {
      id: this.id,
      address: this.address,
      price: this.price,
      startAt: this.startAt,
      endAt: this.endAt,
      creatorId: this.creatorId,
      participant: this.participant?.plain ?? null,
      payerComment: this.payerComment,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
