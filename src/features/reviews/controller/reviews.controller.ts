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
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';

import {
  AccessGuard,
  OptionalAccessGuard,
  RoleGuard,
} from '@features/authentication/guards';
import { Executor, User } from '@features/authentication/decorators';
import { UserEntity } from '@features/users/entities';
import { AdminEntity } from '@features/admins/entities';
import { Id } from '@app/app.declarations';
import ListReviewsDto, { ListReviewsParams } from './dto/list-reviews.dto';
import GetReviewDto from './dto/get-review.dto';
import PostReviewDto from './dto/post-review.dto';
import GetReviewExistenceDto, {
  GetReviewExistenceParams,
} from './dto/get-review-existence.dto';
import ReviewsService from './reviews.service';
import {
  NotParticipatedToReviewException,
  ReviewAlreadyExistsException,
  ReviewNotFoundException,
} from '../exceptions';

@ApiTags('reviews')
@Controller('reviews')
export default class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   * Get paginated list of reviews.
   */
  @Get()
  @UseGuards(OptionalAccessGuard)
  public async find(
    @Query() params: ListReviewsParams,
    @Executor() executor?: AdminEntity | UserEntity,
  ): Promise<ListReviewsDto> {
    return await this.reviewsService.findReviews(params, executor);
  }

  /**
   * Get is your review exist for specified user.
   */
  @Get('existence')
  @ApiBearerAuth()
  @UseGuards(AccessGuard, RoleGuard('user'))
  public async getExistence(
    @Query() params: GetReviewExistenceParams,
    @User() executor: UserEntity,
  ): Promise<GetReviewExistenceDto> {
    return await this.reviewsService.getReviewExistence(params, executor);
  }

  /**
   * Get single review by id.
   */
  @Get(':id')
  @ApiException(() => ReviewNotFoundException, {
    description: 'Cannot find review.',
  })
  public async getById(@Param('id') id: Id): Promise<GetReviewDto> {
    return await this.reviewsService.getReviewById(id);
  }

  /**
   * Create review.
   */
  @Post()
  @ApiBearerAuth()
  @ApiException(() => NotParticipatedToReviewException, {
    description: 'Only participants of user interviews can review his profile.',
  })
  @ApiException(() => ReviewAlreadyExistsException, {
    description: 'Only one review can be created for one profile.',
  })
  @UseGuards(AccessGuard, RoleGuard('user'))
  public async create(
    @Body() dto: PostReviewDto,
    @User() executor: UserEntity,
  ): Promise<GetReviewDto> {
    return await this.reviewsService.addReview(dto, executor);
  }
}
