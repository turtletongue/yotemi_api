import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UserEntity } from '@features/users/entities';
import { User } from '@features/authentication/decorators';
import { AccessGuard, RoleGuard } from '@features/authentication/guards';
import { Id } from '@app/app.declarations';
import ListNotificationsDto, {
  ListNotificationsParams,
} from './dto/list-notifications.dto';
import GetNotificationDto from './dto/get-notification.dto';
import NotificationsService from '../controllers/notifications.service';

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
  public async markAsSeen(
    @Param('id') id: Id,
    @User() executor: UserEntity,
  ): Promise<GetNotificationDto> {
    return await this.notificationsService.markAsSeen(id, executor);
  }
}
