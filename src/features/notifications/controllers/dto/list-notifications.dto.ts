import GetNotificationDto from './get-notification.dto';

export class ListNotificationsParams {}

export default class ListNotificationsDto {
  /**
   * List of notifications.
   */
  public items: GetNotificationDto[];

  /**
   * Count of not seen notifications.
   * @example 10
   */
  public notSeenCount: number;
}
