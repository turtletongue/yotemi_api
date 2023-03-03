import { UserEntity } from '@features/users/entities';
import { Id } from '@app/app.declarations';
import { MS_IN_MINUTE } from '@app/app.constants';
import PlainInterview from './interfaces/plain-interview';

export default class InterviewEntity {
  public readonly remainingMinutesToStart = 15;

  constructor(
    private _id: Id,
    private _address: string,
    private _price: number,
    private _startAt: Date,
    private _endAt: Date,
    private _creatorId: Id,
    private _participant: UserEntity | null,
    private _payerComment: string | null,
    private _createdAt: Date,
    private _updatedAt: Date,
  ) {}

  public get id(): Id {
    return this._id;
  }

  public get address(): string {
    return this._address;
  }

  public get price(): number {
    return this._price;
  }

  public get startAt(): Date {
    return this._startAt;
  }

  public get endAt(): Date {
    return this._endAt;
  }

  public get creatorId(): Id {
    return this._creatorId;
  }

  public get participant(): UserEntity | null {
    return this._participant;
  }

  public set participant(value: UserEntity) {
    this._participant = value;
  }

  public get payerComment(): string {
    return this._payerComment;
  }

  public set payerComment(value: string) {
    this._payerComment = value;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public get isStartTimeCome(): boolean {
    return (
      this.startAt.getTime() - Date.now() <=
      this.remainingMinutesToStart * MS_IN_MINUTE
    );
  }

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
