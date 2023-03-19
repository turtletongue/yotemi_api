import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';

import { AccessGuard, RoleGuard } from '@features/authentication/guards';
import { User } from '@features/authentication/decorators';
import { UserEntity } from '@features/users/entities';
import { InterviewNotFoundException } from '@features/interviews/exceptions';
import { Id } from '@app/app.declarations';
import ListInterviewMessagesDto, {
  ListInterviewMessagesParams,
} from './dto/list-interview-messages.dto';
import PostInterviewMessageDto from './dto/post-interview-message.dto';
import GetInterviewMessageDto from './dto/get-interview-message.dto';
import InterviewMessagesService from './interview-messages.service';
import {
  InterviewMessageNotFoundException,
  InvalidMessagesInterviewStatusException,
} from '../exceptions';

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
  @ApiException(() => ForbiddenException, {
    description: 'Viewing messages of this interview is not allowed.',
  })
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
  @ApiException(() => InterviewMessageNotFoundException, {
    description: 'Cannot find interview message.',
  })
  @ApiException(() => ForbiddenException, {
    description: 'Viewing messages of this interview is not allowed.',
  })
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
  @ApiException(() => ForbiddenException, {
    description: 'Sending messages to this interview is not allowed.',
  })
  @ApiException(() => InterviewNotFoundException, {
    description: 'Cannot find interview.',
  })
  @ApiException(() => InvalidMessagesInterviewStatusException, {
    description: 'Cannot send message because interview has incorrect status.',
  })
  public async create(
    @Body() dto: PostInterviewMessageDto,
    @User() executor: UserEntity,
  ): Promise<GetInterviewMessageDto> {
    return await this.interviewMessagesService.addMessage(dto, executor);
  }
}
