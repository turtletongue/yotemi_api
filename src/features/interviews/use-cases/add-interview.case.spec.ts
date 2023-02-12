import { Test } from '@nestjs/testing';

import { IdentifiersService } from '@common/identifiers';
import { IdentifiersServiceMock } from '@common/mocks';
import { UserEntity, UserFactory } from '@features/users/entities';
import { TopicFactory } from '@features/topics/entities';
import {
  NotificationEntity,
  NotificationFactory,
} from '@features/notifications/entities';
import AddNotificationCase from '@features/notifications/use-cases/add-notification.case';
import NotificationsRepository from '@features/notifications/notifications.repository';
import AddInterviewCase from './add-interview.case';
import InterviewsRepository from '../interviews.repository';
import { InterviewFactory, InterviewEntity } from '../entities';
import { NotificationType } from '@prisma/client';

describe('The AddInterviewCase', () => {
  let addInterviewCase: AddInterviewCase;
  let create: jest.Mock;
  let hasTimeConflict: jest.Mock;

  beforeEach(async () => {
    create = jest.fn();
    hasTimeConflict = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        AddInterviewCase,
        InterviewFactory,
        InterviewsRepository,
        IdentifiersService,
        UserFactory,
        TopicFactory,
        AddNotificationCase,
        NotificationsRepository,
        NotificationFactory,
      ],
    })
      .overrideProvider(InterviewsRepository)
      .useValue({
        create,
        hasTimeConflict,
      })
      .overrideProvider(NotificationsRepository)
      .useValue({
        create: () =>
          new NotificationEntity(
            'id',
            NotificationType.interviewScheduled,
            null,
            false,
            'userId',
            new Date(),
            new Date(),
          ),
      })
      .overrideProvider(IdentifiersService)
      .useValue(IdentifiersServiceMock)
      .compile();

    addInterviewCase = await module.get(AddInterviewCase);
  });

  describe('when adding an interview', () => {
    let interview: InterviewEntity;

    beforeEach(() => {
      interview = new InterviewEntity(
        'id',
        0.001,
        new Date(),
        new Date(Date.now() + 10000),
        'published',
        'creatorId',
        new UserEntity(
          'id',
          '0:910ccf61e24dd425d39e3cfbb25f8d260a0038bf181ee43739be3051f1d8db10',
          'authId',
          'Tom Land',
          '',
          false,
          [],
          0,
          new Date(),
          new Date(),
        ),
        'Some long comment',
        new Date(),
        new Date(),
      );

      create.mockResolvedValue(interview);
      hasTimeConflict.mockResolvedValue(false);
    });

    it('should return the interview', async () => {
      const result = await addInterviewCase.apply({
        price: 0.001,
        startAt: new Date(Date.now() + 1000 * 60 * 60),
        endAt: new Date(Date.now() + 1000 * 60 * 60 * 2),
        executor: new UserEntity(
          'id',
          '0:910ccf61e24dd425d39e3cfbb25f8d260a0038bf181ee43739be3051f1d8db10',
          'authId',
          'Tom Land',
          '',
          false,
          [],
          0,
          new Date(),
          new Date(),
        ),
      });

      expect(result.id).toEqual(interview.id);
    });
  });
});
