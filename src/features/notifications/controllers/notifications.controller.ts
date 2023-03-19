import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';

import { UserEntity } from '@features/users/entities';
import { User } from '@features/authentication/decorators';
import { AccessGuard, RoleGuard } from '@features/authentication/guards';
import { Id } from '@app/app.declarations';
import ListNotificationsDto, {
  ListNotificationsParams,
} from './dto/list-notifications.dto';
import GetNotificationDto from './dto/get-notification.dto';
import NotificationsService from '../controllers/notifications.service';
import { NotificationNotFoundException } from '../exceptions';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(AccessGuard, RoleGuard('user'))
@Controller('notifications')
export default class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * Get paginated list of notifications.
   */
  @Get()
  public async find(
    @Query() params: ListNotificationsParams,
    @User() executor: UserEntity,
  ): Promise<ListNotificationsDto> {
    return await this.notificationsService.findNotifications(params, executor);
  }

  /**
   * Get single notification by id.
   */
  @Get(':id')
  @ApiException(() => NotificationNotFoundException, {
    description: 'Cannot find notification.',
  })
  @ApiException(() => ForbiddenException, {
    description: 'Viewing other users notifications is not allowed.',
  })
  public async getById(
    @Param('id') id: Id,
    @User() executor: UserEntity,
  ): Promise<GetNotificationDto> {
    return await this.notificationsService.getNotificationById(id, executor);
  }

  /**
   * Mark all own notifications as seen.
   */
  @Patch()
  public async markAllAsSeen(
    @User() executor: UserEntity,
  ): Promise<GetNotificationDto[]> {
    return await this.notificationsService.markAllAsSeen(executor);
  }

  /**
   * Mark single notification as seen.
   */
  @Patch(':id')
  @ApiException(() => NotificationNotFoundException, {
    description: 'Cannot find notification to mark as seen.',
  })
  @ApiException(() => ForbiddenException, {
    description: 'Marking other users notifications as seen is not allowed.',
  })
  public async markAsSeen(
    @Param('id') id: Id,
    @User() executor: UserEntity,
  ): Promise<GetNotificationDto> {
    return await this.notificationsService.markAsSeen(id, executor);
  }
}
