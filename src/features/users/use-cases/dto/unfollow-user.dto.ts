import { Id } from '@app/app.declarations';

export default class UnfollowUserDto {
  public followingId: Id;
  public followerId: Id;
}
