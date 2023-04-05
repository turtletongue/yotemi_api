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
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';

import { Id } from '@app/app.declarations';
import {
  AccessGuard,
  OptionalAccessGuard,
  RoleGuard,
} from '@features/authentication/guards';
import { Executor, User } from '@features/authentication/decorators';
import { AdminEntity } from '@features/admins/entities';
import { UserEntity } from '@features/users/entities';
import ListTopicsDto, { ListTopicsParams } from './dto/list-topics.dto';
import PostTopicDto from './dto/post-topic.dto';
import GetTopicDto from './dto/get-topic.dto';
import PatchTopicDto from './dto/patch-topic.dto';
import TopicsService from './topics.service';
import {
  NotUniqueLabelLanguageException,
  TopicNotFoundException,
} from '../exceptions';

@ApiTags('topics')
@Controller('topics')
export default class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  /**
   * Get paginated list of topics.
   */
  @Get()
  @UseGuards(OptionalAccessGuard, RoleGuard('user'))
  public async find(
    @Query() params: ListTopicsParams,
    @User() executor?: UserEntity,
  ): Promise<ListTopicsDto> {
    return await this.topicsService.findTopics(params, executor);
  }

  /**
   * Get single topic by id.
   */
  @Get(':id')
  @ApiException(() => TopicNotFoundException, {
    description: 'Cannot find topic.',
  })
  public async getById(@Param('id') id: Id): Promise<GetTopicDto> {
    return await this.topicsService.getTopicById(id);
  }

  /**
   * Create new topic.
   */
  @Post()
  @ApiBearerAuth()
  @ApiException(() => NotUniqueLabelLanguageException, {
    description:
      'There is must be only one translation of topic for some language.',
  })
  @UseGuards(AccessGuard)
  public async create(
    @Body() dto: PostTopicDto,
    @Executor() executor: AdminEntity | UserEntity,
  ): Promise<GetTopicDto> {
    return await this.topicsService.addTopic(dto, executor);
  }

  /**
   * Update some topic's fields.
   */
  @Patch(':id')
  @ApiBearerAuth()
  @ApiException(() => TopicNotFoundException, {
    description: 'Cannot find topic to update.',
  })
  @ApiException(() => NotUniqueLabelLanguageException, {
    description:
      'There is must be only one translation of topic for some language.',
  })
  @UseGuards(AccessGuard, RoleGuard('admin'))
  public async update(
    @Param('id') id: Id,
    @Body() dto: PatchTopicDto,
  ): Promise<GetTopicDto> {
    return await this.topicsService.updateTopic({ ...dto, id });
  }

  /**
   * Delete topic.
   */
  @Delete(':id')
  @ApiBearerAuth()
  @ApiException(() => TopicNotFoundException, {
    description: 'Cannot find topic to delete.',
  })
  @UseGuards(AccessGuard, RoleGuard('admin'))
  public async delete(@Param('id') id: Id): Promise<GetTopicDto> {
    return await this.topicsService.deleteTopic(id);
  }
}
