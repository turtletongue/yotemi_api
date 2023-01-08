import { UserEntity } from '@features/users/entities';

export default class AddInterviewDto {
  public price: number;
  public startAt: Date;
  public endAt: Date;
  public executor: UserEntity;
}
