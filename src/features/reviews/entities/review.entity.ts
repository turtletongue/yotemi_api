import { UserEntity } from '@features/users/entities';
import { Id } from '@app/app.declarations';
import PlainReview from './interfaces/plain-review';

export default class ReviewEntity {
  constructor(
    private readonly _id: Id,
    private readonly _points: number,
    private readonly _comment: string,
    private readonly _userId: Id,
    private readonly _reviewer: UserEntity,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
  ) {}

  public get id(): Id {
    return this._id;
  }

  public get points(): number {
    return this._points;
  }

  public get comment(): string {
    return this._comment;
  }

  public get userId(): Id {
    return this._userId;
  }

  public get reviewer(): UserEntity {
    return this._reviewer;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public get plain(): PlainReview {
    return {
      id: this.id,
      points: this.points,
      comment: this.comment,
      userId: this.userId,
      reviewer: this.reviewer.plain,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
