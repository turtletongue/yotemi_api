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
import ListReviewsDto, { ListReviewsParams } from './dto/list-reviews.dto';
import GetReviewDto from './dto/get-review.dto';
import PostReviewDto from './dto/post-review.dto';
import ReviewsService from './reviews.service';

@ApiTags('reviews')
@Controller('reviews')
export default class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   * Get paginated list of reviews.
   */
  @Get()
  public async find(
    @Query() params: ListReviewsParams,
  ): Promise<ListReviewsDto> {
    return await this.reviewsService.findReviews(params);
  }

  /**
   * Get single review by id.
   */
  @Get(':id')
  public async getById(@Param('id') id: Id): Promise<GetReviewDto> {
    return await this.reviewsService.getReviewById(id);
  }

  @ApiBearerAuth()
  @UseGuards(AccessGuard, RoleGuard('user'))
  @Post()
  public async create(
    @Body() dto: PostReviewDto,
    @User() executor: UserEntity,
  ): Promise<GetReviewDto> {
    return await this.reviewsService.addReview(dto, executor);
  }
}
