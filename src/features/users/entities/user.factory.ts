import { Injectable } from '@nestjs/common';

import { IdentifiersService } from '@common/identifiers';
import BuildUserDto from './dto/build-user.dto';
import UserEntity from './user.entity';

@Injectable()
export default class UserFactory {
  constructor(private readonly identifiers: IdentifiersService) {}

  public async build({
    id = this.identifiers.generate(),
    accountAddress,
    authId = this.identifiers.generate(),
    fullName,
    biography = '',
    isVerified = false,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: BuildUserDto): Promise<UserEntity> {
    return new UserEntity(
      id,
      accountAddress,
      authId,
      fullName,
      biography,
      isVerified,
      createdAt,
      updatedAt,
    );
  }
}
