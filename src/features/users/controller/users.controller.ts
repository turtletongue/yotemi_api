import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Id } from '@app/app.declarations';
import { AccessGuard } from '@features/authentication/guards';
import { User } from '@features/authentication/decorators';
import ListUsersDto, { ListUsersParams } from './dto/list-users.dto';
import GetUserDto from './dto/get-user.dto';
import PostUserDto from './dto/post-user.dto';
import PatchUserDto from './dto/patch-user.dto';
import UsersService from './users.service';
import { UserEntity } from '../entities';

@ApiTags('users')
@Controller('users')
export default class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get paginated list of users.
   */
  @Get()
  public async find(@Query() params: ListUsersParams): Promise<ListUsersDto> {
    return await this.usersService.findUsers(params);
  }

  /**
   * Get single user by id.
   */
  @Get(':id')
  public async getById(@Param('id') id: Id): Promise<GetUserDto> {
    return await this.usersService.getUserById(id);
  }

  /**
   * Create new user.
   */
  @Post()
  public async create(@Body() dto: PostUserDto): Promise<GetUserDto> {
    return await this.usersService.addUser(dto);
  }

  /**
   * Update some user's fields.
   */
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  @Patch(':id')
  public async update(
    @Param('id') id: Id,
    @Body() dto: PatchUserDto,
    @User() executor: UserEntity,
  ): Promise<GetUserDto> {
    return await this.usersService.updateUser({ ...dto, id }, executor);
  }

  /**
   * Delete user.
   */
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  @Delete(':id')
  public async delete(
    @Param('id') id: Id,
    @User() executor: UserEntity,
  ): Promise<GetUserDto> {
    return await this.usersService.deleteUser(id, executor);
  }
}
