import { PaginatedDto, PaginationParams } from '@common/pagination';
import GetNotificationDto from './get-notification.dto';

export class ListNotificationsParams extends PaginationParams {}

export default class ListNotificationsDto extends PaginatedDto(
  GetNotificationDto,
) {}
