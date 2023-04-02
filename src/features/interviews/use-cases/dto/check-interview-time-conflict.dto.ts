import { UserEntity } from '@features/users/entities';

export default class CheckInterviewTimeConflictDto {
  public startAt: Date;
  public endAt: Date;
  public executor: UserEntity;
}
