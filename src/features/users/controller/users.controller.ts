import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';

import { Id } from '@app/app.declarations';
import {
  AccessGuard,
  OptionalAccessGuard,
  RoleGuard,
} from '@features/authentication/guards';
import { Executor, User } from '@features/authentication/decorators';
import { AdminEntity } from '@features/admins/entities';
import ListUsersDto, { ListUsersParams } from './dto/list-users.dto';
import GetUserDto from './dto/get-user.dto';
import PostUserDto from './dto/post-user.dto';
import PatchUserDto from './dto/patch-user.dto';
import UsersService from './users.service';
import { UserEntity } from '../entities';
import { AddressIsTakenException, UserNotFoundException } from '../exceptions';

@ApiTags('users')
@Controller('users')
export default class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get paginated list of users.
   */
  @UseGuards(OptionalAccessGuard)
  @Get()
  public async find(
    @Query() params: ListUsersParams,
    @Executor() executor?: UserEntity | AdminEntity,
  ): Promise<ListUsersDto> {
    return await this.usersService.findUsers(params, executor);
  }

  /**
   * Get single user by id.
   */
  @ApiException(() => UserNotFoundException, {
    description: 'Cannot find user.',
  })
  @Get(':id')
  public async getById(@Param('id') id: Id): Promise<GetUserDto> {
    return await this.usersService.getUserById(id);
  }

  /**
   * Create new user.
   */
  @ApiException(() => AddressIsTakenException, {
    description: 'Another account address must be used instead.',
  })
  @Post()
  public async create(@Body() dto: PostUserDto): Promise<GetUserDto> {
    return await this.usersService.addUser(dto);
  }

  /**
   * Update some user's fields.
   */
  @ApiBearerAuth()
  @ApiException(() => ForbiddenException, {
    description: 'You cannot edit another user.',
  })
  @ApiException(() => UserNotFoundException, {
    description: 'Cannot find user to update.',
  })
  @UseGuards(AccessGuard, RoleGuard('user'))
  @Patch(':id')
  public async update(
    @Param('id') id: Id,
    @Body() dto: PatchUserDto,
    @User() executor: UserEntity,
  ): Promise<GetUserDto> {
    return await this.usersService.updateUser({ ...dto, id }, executor);
  }

  /**
   * Change avatar.
   */
  @ApiBearerAuth()
  @ApiException(() => ForbiddenException, {
    description: 'You cannot edit another user.',
  })
  @ApiException(() => UserNotFoundException, {
    description: 'Cannot find user to update.',
  })
  @ApiException(() => InternalServerErrorException, {
    description: 'File uploading or replacing failed.',
  })
  @ApiConsumes('form-data')
  @UseGuards(AccessGuard, RoleGuard('user'))
  @UseInterceptors(FileInterceptor('file'))
  @Post(':id/avatar')
  public async changeAvatar(
    @Param('id') id: Id,
    @User() executor: UserEntity,
    @UploadedFile('file') file?: Express.Multer.File,
  ): Promise<void> {
    if (!file) {
      throw new BadRequestException(
        "Provide upload in 'file' field of form-data.",
      );
    }

    return await this.usersService.changeAvatar(
      id,
      { path: file.path },
      executor,
    );
  }

  /**
   * Change cover.
   */
  @ApiBearerAuth()
  @ApiException(() => ForbiddenException, {
    description: 'You cannot edit another user.',
  })
  @ApiException(() => UserNotFoundException, {
    description: 'Cannot find user to update.',
  })
  @ApiException(() => InternalServerErrorException, {
    description: 'File uploading or replacing failed.',
  })
  @ApiConsumes('form-data')
  @UseGuards(AccessGuard, RoleGuard('user'))
  @UseInterceptors(FileInterceptor('file'))
  @Post(':id/cover')
  public async changeCover(
    @Param('id') id: Id,
    @User() executor: UserEntity,
    @UploadedFile('file') file?: Express.Multer.File,
  ): Promise<void> {
    if (!file) {
      throw new BadRequestException(
        "Provide upload in 'file' field of form-data.",
      );
    }

    return await this.usersService.changeCover(
      id,
      { path: file.path },
      executor,
    );
  }

  /**
   * Delete user.
   */
  @ApiBearerAuth()
  @ApiException(() => ForbiddenException, {
    description: 'You cannot delete another user.',
  })
  @ApiException(() => UserNotFoundException, {
    description: 'Cannot find user to delete.',
  })
  @UseGuards(AccessGuard, RoleGuard('user'))
  @Delete(':id')
  public async delete(
    @Param('id') id: Id,
    @User() executor: UserEntity,
  ): Promise<GetUserDto> {
    return await this.usersService.deleteUser(id, executor);
  }
}
