import { Test } from '@nestjs/testing';
import { NotificationType } from '@prisma/client';

import { IdentifiersService } from '@common/identifiers';
import InterviewContractService from '@common/ton/interview-contract.service';
import { IdentifiersServiceMock } from '@test/mocks';
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
import CheckInterviewTimeConflictCase from './check-interview-time-conflict.case';
import { InterviewFactory, InterviewEntity } from '../entities';

describe('The AddInterviewCase', () => {
  let addInterviewCase: AddInterviewCase;
  let create: jest.Mock;
  let isCodeMalformed: jest.Mock;
  let isAddressTaken: jest.Mock;
  let hasTimeConflict: jest.Mock;

  beforeEach(async () => {
    create = jest.fn();
    isCodeMalformed = jest.fn();
    isAddressTaken = jest.fn();
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
        CheckInterviewTimeConflictCase,
        NotificationsRepository,
        NotificationFactory,
        InterviewContractService,
      ],
    })
      .overrideProvider(InterviewsRepository)
      .useValue({
        create,
        isAddressTaken,
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
      .overrideProvider(InterviewContractService)
      .useValue({
        isCodeMalformed,
      })
      .compile();

    addInterviewCase = await module.get(AddInterviewCase);
  });

  describe('when adding an interview', () => {
    let interview: InterviewEntity;

    beforeEach(() => {
      interview = new InterviewEntity(
        'id',
        'EQC9wO6nyVru4kxshaLgAGLlX69EdDLqlm5H5pzKcmPIpodW',
        0.001,
        new Date(),
        new Date(Date.now() + 10000),
        null,
        'creatorId',
        'creatorPeerId',
        new UserEntity(
          'id',
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
        'participantPeerId',
        'Some long comment',
        true,
        new Date(),
        new Date(),
      );

      create.mockResolvedValue(interview);
      isCodeMalformed.mockResolvedValue(false);
      isAddressTaken.mockResolvedValue(false);
      hasTimeConflict.mockResolvedValue(false);
    });

    it('should return the interview', async () => {
      const result = await addInterviewCase.apply({
        address: 'EQC9wO6nyVru4kxshaLgAGLlX69EdDLqlm5H5pzKcmPIpodW',
        price: 0.001,
        startAt: new Date(Date.now() + 1000 * 60 * 60),
        endAt: new Date(Date.now() + 1000 * 60 * 60 * 2),
        executor: new UserEntity(
          'id',
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

      expect(result.id).toEqual(interview.id);
    });
  });
});
