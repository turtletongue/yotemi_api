import { NotificationType } from '@prisma/client';

import { Id } from '@app/app.declarations';

export default class GetNotificationDto {
  /**
   * Unique identifier of topic.
   * @example '0337b3d8-4391-471c-a111-1b7da3932a01'
   */
  public id: Id;

  /**
   * Type of the notification.
   * @example 'newFollower'
   */
  public type: NotificationType;

  /**
   * Object with properties related to notification's type.
   * @example null
   */
  public content: Record<string, unknown> | null;

  /**
   * Is notification seen.
   * @example false
   */
  public isSeen: boolean | null;

  /**
   * Identifier of the user who received notification.
   * @example '75442486-0878-440c-9db1-a7006c25a39f'
   */
  public userId: Id;

  /**
   * Date and time of topic creation.
   * @example '2022-10-15T00:00:00.000Z'
   */
  public createdAt: Date;

  /**
   * Date and time of last topic update.
   * @example '2022-10-15T00:00:00.000Z'
   */
  public updatedAt: Date;
}
