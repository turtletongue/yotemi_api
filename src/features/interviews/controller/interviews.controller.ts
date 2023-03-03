import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Id } from '@app/app.declarations';
import { User } from '@features/authentication/decorators';
import { AccessGuard, RoleGuard } from '@features/authentication/guards';
import { UserEntity } from '@features/users/entities';
import ListInterviewsDto, {
  ListInterviewsParams,
} from './dto/list-interviews.dto';
import GetInterviewDto from './dto/get-interview.dto';
import PostInterviewDto from './dto/post-interview.dto';
import InterviewsService from './interviews.service';
import PatchInterviewDto from './dto/patch-interview.dto';

@ApiTags('interviews')
@Controller('interviews')
export default class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  /**
   * Get list of interviews.
   */
  @Get()
  public async find(
    @Query() params: ListInterviewsParams,
  ): Promise<ListInterviewsDto> {
    return await this.interviewsService.findInterviews(params);
  }

  /**
   * Get single interview by id.
   */
  @Get(':id')
  public async getById(@Param('id') id: Id): Promise<GetInterviewDto> {
    return await this.interviewsService.getInterviewById(id);
  }

  /**
   * Create new interview.
   */
  @ApiBearerAuth()
  @UseGuards(AccessGuard, RoleGuard('user'))
  @Post()
  public async create(
    @Body() dto: PostInterviewDto,
    @User() executor: UserEntity,
  ): Promise<GetInterviewDto> {
    return await this.interviewsService.addInterview(dto, executor);
  }

  /**
   * Confirm payment to purchase interview.
   */
  @ApiBearerAuth()
  @UseGuards(AccessGuard, RoleGuard('user'))
  @Patch(':id')
  public async confirmPayment(
    @Param('id') id: Id,
    @Body() dto: PatchInterviewDto,
    @User() executor: UserEntity,
  ): Promise<GetInterviewDto> {
    return await this.interviewsService.confirmPayment(id, dto, executor);
  }
}
