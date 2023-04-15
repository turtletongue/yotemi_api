import { UserEntity } from '@features/users/entities';
import { Id } from '@app/app.declarations';
import PlainReview from './interfaces/plain-review';

export default class ReviewEntity {
  constructor(
    public id: Id,
    public points: number,
    public comment: string,
    public userId: Id,
    public reviewer: UserEntity,
    public isModerated: boolean,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  public get plain(): PlainReview {
    return {
      id: this.id,
      points: this.points,
      comment: this.comment,
      userId: this.userId,
      reviewer: this.reviewer.plain,
      isModerated: this.isModerated,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
