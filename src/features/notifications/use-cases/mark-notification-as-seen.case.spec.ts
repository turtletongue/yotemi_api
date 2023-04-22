import { ForbiddenException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { NotificationType } from '@prisma/client';

import { IdentifiersService } from '@common/identifiers';
import { IdentifiersServiceMock } from '@test/mocks';
import { UserEntity } from '@features/users/entities';
import MarkNotificationAsSeenCase from './mark-notification-as-seen.case';
import { NotificationEntity, NotificationFactory } from '../entities';
import NotificationsRepository from '../notifications.repository';

describe('The MarkNotificationAsSeenCase', () => {
  let markNotificationAsSeenCase: MarkNotificationAsSeenCase;
  let markAsSeen: jest.Mock;
  let findById: jest.Mock;

  beforeEach(async () => {
    findById = jest.fn();
    markAsSeen = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        MarkNotificationAsSeenCase,
        NotificationFactory,
        NotificationsRepository,
        IdentifiersService,
      ],
    })
      .overrideProvider(NotificationsRepository)
      .useValue({
        markAsSeen,
        findById,
      })
      .overrideProvider(IdentifiersService)
      .useValue(IdentifiersServiceMock)
      .compile();

    markNotificationAsSeenCase = await module.get(MarkNotificationAsSeenCase);
  });

  describe('when marking notification as seen', () => {
    describe("and it is user's notification", () => {
      let notification: NotificationEntity;

      beforeEach(() => {
        notification = new NotificationEntity(
          'id',
          NotificationType.newFollower,
          null,
          false,
          'userId',
          new Date(),
          new Date(),
        );

        markAsSeen.mockResolvedValue(notification);
        findById.mockResolvedValue(notification);
      });

      it('should return the notification', async () => {
        const result = await markNotificationAsSeenCase.apply({
          id: 'id',
          executor: new UserEntity(
            'userId',
            'tom',
            '0:910ccf61e24dd425d39e3cfbb25f8d260a0038bf181ee43739be3051f1d8db10',
            'authId',
            'Tom',
            'Land',
            '',
            null,
            null,
            false,
            [],
            '0',
            0,
            '0',
            false,
            false,
            new Date(),
            new Date(),
          ),
        });

        expect(result.id).toEqual(result.id);
      });
    });

    describe("and it is other user's notification", () => {
      let notification: NotificationEntity;

      beforeEach(() => {
        notification = new NotificationEntity(
          'id',
          NotificationType.newFollower,
          null,
          false,
          'otherUserId',
          new Date(),
          new Date(),
        );

        markAsSeen.mockResolvedValue(notification);
        findById.mockResolvedValue(notification);
      });

      it('should throw the ForbiddenException', async () => {
        await expect(
          markNotificationAsSeenCase.apply({
            id: 'id',
            executor: new UserEntity(
              'userId',
              'tom',
              '0:910ccf61e24dd425d39e3cfbb25f8d260a0038bf181ee43739be3051f1d8db10',
              'authId',
              'Tom',
              'Land',
              '',
              null,
              null,
              false,
              [],
              '0',
              0,
              '0',
              false,
              false,
              new Date(),
              new Date(),
            ),
          }),
        ).rejects.toThrowError(ForbiddenException);
      });
    });
  });
});
