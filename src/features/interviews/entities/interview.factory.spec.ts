import { Test } from '@nestjs/testing';

import { IdentifiersService } from '@common/identifiers';
import { IdentifiersServiceMock } from '@test/mocks';
import { UserFactory } from '@features/users/entities';
import { TopicFactory } from '@features/topics/entities';
import InterviewFactory from './interview.factory';
import InterviewEntity from './interview.entity';

describe('The InterviewFactory', () => {
  let interviewFactory: InterviewFactory;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        InterviewFactory,
        IdentifiersService,
        UserFactory,
        TopicFactory,
      ],
    })
      .overrideProvider(IdentifiersService)
      .useValue(IdentifiersServiceMock)
      .compile();

    interviewFactory = await module.get(InterviewFactory);
  });

  describe('when building an interview', () => {
    it('should return instance of InterviewEntity', async () => {
      const interview = await interviewFactory.build({
        address: 'EQBYd5Ud1NyDH-iutpPtLCvrMBh1TQWVmhjvd-zbziEuaz9g',
        price: 0.0001,
        startAt: new Date(),
        endAt: new Date(),
        creatorId: 'creatorId',
      });

      expect(interview).toBeInstanceOf(InterviewEntity);
    });
  });
});
