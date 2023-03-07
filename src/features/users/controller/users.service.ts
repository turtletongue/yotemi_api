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
import FindUsersCase from '../use-cases/find-users.case';
import AddUserCase from '../use-cases/add-user.case';
import UpdateUserCase from '../use-cases/update-user.case';
import DeleteUserCase from '../use-cases/delete-user.case';
import ChangeAvatarCase from '../use-cases/change-avatar.case';
import ChangeCoverCase from '../use-cases/change-cover.case';

@Injectable()
export default class UsersService {
  constructor(
    private readonly getUserByIdCase: GetUserByIdCase,
    private readonly findUsersCase: FindUsersCase,
    private readonly addUserCase: AddUserCase,
    private readonly updateUserCase: UpdateUserCase,
    private readonly changeAvatarCase: ChangeAvatarCase,
    private readonly changeCoverCase: ChangeCoverCase,
    private readonly deleteUserCase: DeleteUserCase,
  ) {}

  public async getUserById(id: Id): Promise<GetUserDto> {
    return await this.getUserByIdCase.apply(id);
  }

  public async findUsers(params: ListUsersParams): Promise<ListUsersDto> {
    return await this.findUsersCase.apply(params);
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
