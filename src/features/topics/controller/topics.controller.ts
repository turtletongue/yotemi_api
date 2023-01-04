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
import { AccessGuard, RoleGuard } from '@features/authentication/guards';
import ListTopicsDto, { ListTopicsParams } from './dto/list-topics.dto';
import PostTopicDto from './dto/post-topic.dto';
import GetTopicDto from './dto/get-topic.dto';
import PatchTopicDto from './dto/patch-topic.dto';
import TopicsService from './topics.service';

@ApiTags('topics')
@Controller('topics')
export default class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  /**
   * Get paginated list of topics.
   */
  @Get()
  public async find(@Query() params: ListTopicsParams): Promise<ListTopicsDto> {
    return await this.topicsService.findTopics(params);
  }

  /**
   * Get single topic by id.
   */
  @Get(':id')
  public async getById(@Param('id') id: Id): Promise<GetTopicDto> {
    return await this.topicsService.getTopicById(id);
  }

  /**
   * Create new topic.
   */
  @ApiBearerAuth()
  @UseGuards(AccessGuard, RoleGuard('admin'))
  @Post()
  public async create(@Body() dto: PostTopicDto): Promise<GetTopicDto> {
    return await this.topicsService.addTopic(dto);
  }

  /**
   * Update some topic's fields.
   */
  @ApiBearerAuth()
  @UseGuards(AccessGuard, RoleGuard('admin'))
  @Patch(':id')
  public async update(
    @Param('id') id: Id,
    @Body() dto: PatchTopicDto,
  ): Promise<GetTopicDto> {
    return await this.topicsService.updateTopic({ ...dto, id });
  }

  /**
   * Delete topic.
   */
  @ApiBearerAuth()
  @UseGuards(AccessGuard, RoleGuard('admin'))
  @Delete(':id')
  public async delete(@Param('id') id: Id): Promise<GetTopicDto> {
    return await this.topicsService.deleteTopic(id);
  }
}
