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
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';

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
  public async find(
    @Query() params: ListInterviewsParams,
  ): Promise<ListInterviewsDto> {
    return await this.interviewsService.findInterviews(params);
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
}
