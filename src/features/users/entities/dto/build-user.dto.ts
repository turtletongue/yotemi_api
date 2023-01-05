import { Id } from '@app/app.declarations';
import BuildTopicDto from '@features/topics/entities/dto/build-topic.dto';

export default class BuildUserDto {
  public id?: Id;
  public accountAddress: string;
  public authId?: Id;
  public fullName: string;
  public biography?: string;
  public isVerified?: boolean;
  public topics?: BuildTopicDto[];
  public followersCount?: number;
  public createdAt?: Date;
  public updatedAt?: Date;
}
