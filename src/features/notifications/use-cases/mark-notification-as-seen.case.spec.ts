import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { NotificationType } from '@prisma/client';

import { IdentifiersService } from '@common/identifiers';
import { IdentifiersServiceMock } from '@common/mocks';
import { UserEntity } from '@features/users/entities';
import MarkNotificationAsSeenCase from './mark-notification-as-seen.case';
import { NotificationEntity, NotificationFactory } from '../entities';
import NotificationsRepository from '../notifications.repository';

describe('The MarkNotificationAsSeenCase', () => {
  let markNotificationAsSeenCase: MarkNotificationAsSeenCase;
  let update: jest.Mock;
  let findById: jest.Mock;

  beforeEach(async () => {
    findById = jest.fn();
    update = jest.fn();

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
        update,
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

        update.mockResolvedValue(notification);
        findById.mockResolvedValue(notification);
      });

      it('should return the notification', async () => {
        const result = await markNotificationAsSeenCase.apply({
          id: 'id',
          executor: new UserEntity(
            'userId',
            'address',
            'authId',
            'Tom',
            'biography',
            false,
            [],
            0,
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

        update.mockResolvedValue(notification);
        findById.mockResolvedValue(notification);
      });

      it('should throw the UnauthorizedException', async () => {
        await expect(
          markNotificationAsSeenCase.apply({
            id: 'id',
            executor: new UserEntity(
              'userId',
              'address',
              'authId',
              'Tom',
              'biography',
              false,
              [],
              0,
              new Date(),
              new Date(),
            ),
          }),
        ).rejects.toThrowError(UnauthorizedException);
      });
    });
  });
});
