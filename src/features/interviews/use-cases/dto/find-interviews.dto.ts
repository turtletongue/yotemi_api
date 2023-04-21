import { PaginationParams } from '@common/pagination';
import { UserEntity } from '@features/users/entities';
import { AdminEntity } from '@features/admins/entities';
import { Id } from '@app/app.declarations';

export default class FindInterviewsDto extends PaginationParams {
  public creatorId?: Id;
  public participantId?: Id;
  public from?: Date;
  public to?: Date;
  public executor?: AdminEntity | UserEntity;
}
