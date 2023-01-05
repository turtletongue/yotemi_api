import { UserEntity } from '@features/users/entities';

export default class AddInterviewDto {
  public price: number;
  public date: Date;
  public executor: UserEntity;
}
