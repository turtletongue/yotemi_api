import AddNotificationCase from './add-notification.case';
import MarkNotificationAsSeenCase from './mark-notification-as-seen.case';
import MarkAllNotificationsAsSeenCase from './mark-all-notifications-as-seen.case';
import GetNotificationByIdCase from './get-notification-by-id.case';
import FindNotificationsCase from './find-notifications.case';

const notificationUseCases = [
  AddNotificationCase,
  MarkNotificationAsSeenCase,
  MarkAllNotificationsAsSeenCase,
  GetNotificationByIdCase,
  FindNotificationsCase,
];

export default notificationUseCases;
