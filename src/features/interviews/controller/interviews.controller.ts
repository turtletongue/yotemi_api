import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';

import { Id } from '@app/app.declarations';
import { Executor, User } from '@features/authentication/decorators';
import {
  AccessGuard,
  OptionalAccessGuard,
  RoleGuard,
} from '@features/authentication/guards';
import { UserEntity } from '@features/users/entities';
import { AdminEntity } from '@features/admins/entities';
import ListInterviewsDto, {
  ListInterviewsParams,
} from './dto/list-interviews.dto';
import GetInterviewDto from './dto/get-interview.dto';
import PostInterviewDto from './dto/post-interview.dto';
import PatchInterviewDto from './dto/patch-interview.dto';
import PostInterviewTimeCheckDto from './dto/post-interview-time-check.dto';
import PostPeerIdsDto from './dto/post-peer-ids.dto';
import InterviewsService from './interviews.service';
import {
  AddressNotUniqueException,
  ContractMalformedException,
  InterviewHasTimeConflictException,
  InterviewInPastException,
  InterviewNotFoundException,
  InterviewNotPaidException,
  InterviewsTimeFilterTooWideException,
  InvalidInterviewEndDateException,
  NotPayerException,
  PaymentAlreadyConfirmedException,
} from '../exceptions';

@ApiTags('interviews')
@Controller('interviews')
export default class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  /**
   * Get list of interviews.
   */
  @Get()
  @ApiException(() => InterviewsTimeFilterTooWideException, {
    description: 'Too wide time interval filter.',
  })
  @UseGuards(OptionalAccessGuard)
  public async find(
    @Query() params: ListInterviewsParams,
    @Executor() executor?: AdminEntity | UserEntity,
  ): Promise<ListInterviewsDto> {
    return await this.interviewsService.findInterviews(params, executor);
  }

  /**
   * Get single interview by id.
   */
  @Get(':id')
  @ApiException(() => InterviewNotFoundException, {
    description: 'Cannot find interview.',
  })
  public async getById(@Param('id') id: Id): Promise<GetInterviewDto> {
    return await this.interviewsService.getInterviewById(id);
  }

  /**
   * Create new interview.
   */
  @Post()
  @ApiBearerAuth()
  @ApiException(() => InterviewInPastException, {
    description: 'Cannot create interview in past.',
  })
  @ApiException(() => InvalidInterviewEndDateException, {
    description: 'End date of interview cannot be before start date.',
  })
  @ApiException(() => AddressNotUniqueException, {
    description: 'There is already interview with this smart contract address.',
  })
  @ApiException(() => InterviewHasTimeConflictException, {
    description: 'Two interviews have conflict in time.',
  })
  @ApiException(() => ContractMalformedException, {
    description: 'Interview smart contract is malformed.',
  })
  @UseGuards(AccessGuard, RoleGuard('user'))
  public async create(
    @Body() dto: PostInterviewDto,
    @User() executor: UserEntity,
  ): Promise<GetInterviewDto> {
    return await this.interviewsService.addInterview(dto, executor);
  }

  /**
   * Check interview time conflict.
   */
  @Post('check-conflicts')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Conflicts are not found.' })
  @ApiException(() => InterviewInPastException, {
    description: 'Cannot create interview in past.',
  })
  @ApiException(() => InvalidInterviewEndDateException, {
    description: 'End date of interview cannot be before start date.',
  })
  @ApiException(() => InterviewHasTimeConflictException, {
    description: 'Two interviews have conflict in time.',
  })
  @UseGuards(AccessGuard, RoleGuard('user'))
  public async checkTimeConflict(
    @Body() dto: PostInterviewTimeCheckDto,
    @User() executor: UserEntity,
  ): Promise<void> {
    return await this.interviewsService.checkInterviewTimeConflict(
      dto,
      executor,
    );
  }

  /**
   * Confirm payment to purchase interview.
   */
  @Patch(':id')
  @ApiBearerAuth()
  @ApiException(() => InterviewNotPaidException, {
    description: 'Interview is not paid.',
  })
  @ApiException(() => NotPayerException, {
    description: 'Payment can be confirmed only by payer.',
  })
  @ApiException(() => PaymentAlreadyConfirmedException, {
    description: 'Payment already confirmed.',
  })
  @UseGuards(AccessGuard, RoleGuard('user'))
  public async confirmPayment(
    @Param('id') id: Id,
    @Body() dto: PatchInterviewDto,
    @User() executor: UserEntity,
  ): Promise<GetInterviewDto> {
    return await this.interviewsService.confirmPayment(id, dto, executor);
  }

  /**
   * Take interview peer id.
   */
  @Post(':id/take-peer')
  @ApiBearerAuth()
  @ApiException(() => InterviewNotFoundException, {
    description: 'Cannot find interview to take peer id.',
  })
  @ApiException(() => ForbiddenException, {
    description: 'Must be interview participant or creator to take his peer id',
  })
  @UseGuards(AccessGuard, RoleGuard('user'))
  public async takePeerIds(
    @Param('id') id: Id,
    @User() executor: UserEntity,
  ): Promise<PostPeerIdsDto> {
    return await this.interviewsService.takePeerIds(id, executor);
  }
}
