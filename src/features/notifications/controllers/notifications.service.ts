import { Injectable } from '@nestjs/common';

import { UserEntity } from '@features/users/entities';
import { Id } from '@app/app.declarations';
import GetNotificationDto from './dto/get-notification.dto';
import ListNotificationsDto, {
  ListNotificationsParams,
} from './dto/list-notifications.dto';
import GetNotificationByIdCase from '../use-cases/get-notification-by-id.case';
import FindNotificationsCase from '../use-cases/find-notifications.case';
import MarkNotificationAsSeenCase from '../use-cases/mark-notification-as-seen.case';
import MarkAllNotificationsAsSeenCase from '../use-cases/mark-all-notifications-as-seen.case';

@Injectable()
export default class NotificationsService {
  constructor(
    private readonly getNotificationByIdCase: GetNotificationByIdCase,
    private readonly findNotificationsCase: FindNotificationsCase,
    private readonly markNotificationAsSeen: MarkNotificationAsSeenCase,
    private readonly markAllNotificationsAsSeen: MarkAllNotificationsAsSeenCase,
  ) {}

  public async getNotificationById(
    id: Id,
    executor: UserEntity,
  ): Promise<GetNotificationDto> {
    return await this.getNotificationByIdCase.apply(id, executor);
  }

  public async findNotifications(
    params: ListNotificationsParams,
    executor: UserEntity,
  ): Promise<ListNotificationsDto> {
    return await this.findNotificationsCase.apply({ ...params, executor });
  }

  public async markAsSeen(
    id: Id,
    executor: UserEntity,
  ): Promise<GetNotificationDto> {
    return await this.markNotificationAsSeen.apply({ id, executor });
  }

  public async markAllAsSeen(
    executor: UserEntity,
  ): Promise<GetNotificationDto[]> {
    return await this.markAllNotificationsAsSeen.apply({ executor });
  }
}
