import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AccessGuard, RoleGuard } from '@features/authentication/guards';
import { User } from '@features/authentication/decorators';
import { UserEntity } from '@features/users/entities';
import { Id } from '@app/app.declarations';
import ListInterviewMessagesDto, {
  ListInterviewMessagesParams,
} from './dto/list-interview-messages.dto';
import PostInterviewMessageDto from './dto/post-interview-message.dto';
import GetInterviewMessageDto from './dto/get-interview-message.dto';
import InterviewMessagesService from './interview-messages.service';

@ApiTags('interview-messages')
@ApiBearerAuth()
@UseGuards(AccessGuard, RoleGuard('user'))
@Controller('interview-messages')
export default class InterviewMessagesController {
  constructor(
    private readonly interviewMessagesService: InterviewMessagesService,
  ) {}

  /**
   * Get list of messages.
   */
  @Get()
  public async find(
    @Query() params: ListInterviewMessagesParams,
    @User() executor: UserEntity,
  ): Promise<ListInterviewMessagesDto> {
    return await this.interviewMessagesService.findMessages(params, executor);
  }

  /**
   * Get single message by id.
   */
  @Get(':id')
  public async getById(
    @Param('id') id: Id,
    @User() executor: UserEntity,
  ): Promise<GetInterviewMessageDto> {
    return await this.interviewMessagesService.getMessageById(id, executor);
  }

  /**
   * Create new message.
   */
  @Post()
  public async create(
    @Body() dto: PostInterviewMessageDto,
    @User() executor: UserEntity,
  ): Promise<GetInterviewMessageDto> {
    return await this.interviewMessagesService.addMessage(dto, executor);
  }
}
