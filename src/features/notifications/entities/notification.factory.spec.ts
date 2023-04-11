import { Test } from '@nestjs/testing';
import { NotificationType } from '@prisma/client';

import { IdentifiersService } from '@common/identifiers';
import { IdentifiersServiceMock } from '@test/mocks';
import NotificationFactory from './notification.factory';
import NotificationEntity from './notification.entity';

describe('The NotificationFactory', () => {
  let notificationFactory: NotificationFactory;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [NotificationFactory, IdentifiersService],
    })
      .overrideProvider(IdentifiersService)
      .useValue(IdentifiersServiceMock)
      .compile();

    notificationFactory = await module.get(NotificationFactory);
  });

  describe('when building a notification', () => {
    it('should return instance of NotificationEntity', async () => {
      const notification = await notificationFactory.build({
        type: NotificationType.newFollower,
        content: {
          followerId: 'followerId',
        },
        userId: 'userId',
      });

      expect(notification).toBeInstanceOf(NotificationEntity);
    });
  });
});
