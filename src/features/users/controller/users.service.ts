import { Injectable } from '@nestjs/common';

import { Id } from '@app/app.declarations';
import { UserEntity } from '@features/users/entities';
import GetUserDto from './dto/get-user.dto';
import ListUsersDto, { ListUsersParams } from './dto/list-users.dto';
import PostUserDto from './dto/post-user.dto';
import PatchUserDto from './dto/patch-user.dto';
import PostAvatarDto from './dto/post-avatar.dto';
import PostCoverDto from './dto/post-cover.dto';
import GetUserByIdCase from '../use-cases/get-user-by-id.case';
import GetUserByUsernameCase from '../use-cases/get-user-by-username.case';
import GetUserByAccountAddressCase from '../use-cases/get-user-by-account-address.case';
import FindUsersCase from '../use-cases/find-users.case';
import AddUserCase from '../use-cases/add-user.case';
import UpdateUserCase from '../use-cases/update-user.case';
import BlockUserCase from '../use-cases/block-user.case';
import UnblockUserCase from '../use-cases/unblock-user.case';
import DeleteUserCase from '../use-cases/delete-user.case';
import ChangeAvatarCase from '../use-cases/change-avatar.case';
import ChangeCoverCase from '../use-cases/change-cover.case';

@Injectable()
export default class UsersService {
  constructor(
    private readonly getUserByIdCase: GetUserByIdCase,
    private readonly getUserByUsernameCase: GetUserByUsernameCase,
    private readonly getUserByAccountAddressCase: GetUserByAccountAddressCase,
    private readonly findUsersCase: FindUsersCase,
    private readonly addUserCase: AddUserCase,
    private readonly updateUserCase: UpdateUserCase,
    private readonly blockUserCase: BlockUserCase,
    private readonly unblockUserCase: UnblockUserCase,
    private readonly changeAvatarCase: ChangeAvatarCase,
    private readonly changeCoverCase: ChangeCoverCase,
    private readonly deleteUserCase: DeleteUserCase,
  ) {}

  public async getUserById(id: Id, executor?: UserEntity): Promise<GetUserDto> {
    return await this.getUserByIdCase.apply(id, executor);
  }

  public async getUserByUsername(
    username: string,
    executor?: UserEntity,
  ): Promise<GetUserDto> {
    return await this.getUserByUsernameCase.apply(username, executor);
  }

  public async getUserByAccountAddress(
    address: string,
    executor?: UserEntity,
  ): Promise<GetUserDto> {
    return await this.getUserByAccountAddressCase.apply(address, executor);
  }

  public async findUsers(
    params: ListUsersParams,
    executor?: UserEntity,
  ): Promise<ListUsersDto> {
    return await this.findUsersCase.apply({ ...params, executor });
  }

  public async addUser(dto: PostUserDto): Promise<GetUserDto> {
    return await this.addUserCase.apply(dto);
  }

  public async updateUser(
    dto: PatchUserDto,
    executor: UserEntity,
  ): Promise<GetUserDto> {
    return await this.updateUserCase.apply({ ...dto, executor });
  }

  public async blockUser(id: Id): Promise<void> {
    return await this.blockUserCase.apply(id);
  }

  public async unblockUser(id: Id): Promise<void> {
    return await this.unblockUserCase.apply(id);
  }

  public async changeAvatar(
    id: Id,
    dto: PostAvatarDto,
    executor: UserEntity,
  ): Promise<void> {
    return await this.changeAvatarCase.apply({ ...dto, id, executor });
  }

  public async changeCover(
    id: Id,
    dto: PostCoverDto,
    executor: UserEntity,
  ): Promise<void> {
    return await this.changeCoverCase.apply({ ...dto, id, executor });
  }

  public async deleteUser(id: Id, executor: UserEntity): Promise<GetUserDto> {
    return await this.deleteUserCase.apply({ id, executor });
  }
}
