import MarkNotificationAsSeenCase from './mark-notification-as-seen.case';
import MarkAllNotificationsAsSeenCase from './mark-all-notifications-as-seen.case';
import GetNotificationByIdCase from './get-notification-by-id.case';
import FindNotificationsCase from './find-notifications.case';

const notificationUseCases = [
  MarkNotificationAsSeenCase,
  MarkAllNotificationsAsSeenCase,
  GetNotificationByIdCase,
  FindNotificationsCase,
];

export default notificationUseCases;
