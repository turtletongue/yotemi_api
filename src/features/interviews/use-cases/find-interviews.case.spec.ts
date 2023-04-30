import { Test } from '@nestjs/testing';

import { IdentifiersService } from '@common/identifiers';
import { IdentifiersServiceMock } from '@test/mocks';
import { UserEntity, UserFactory } from '@features/users/entities';
import { TopicFactory } from '@features/topics/entities';
import FindInterviewsCase from './find-interviews.case';
import InterviewsRepository from '../interviews.repository';
import { InterviewFactory, InterviewEntity, PlainInterview } from '../entities';

describe('The FindReviewsCase', () => {
  let findInterviewsCase: FindInterviewsCase;
  let findAll: jest.Mock;

  beforeEach(async () => {
    findAll = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        FindInterviewsCase,
        InterviewFactory,
        InterviewsRepository,
        IdentifiersService,
        UserFactory,
        TopicFactory,
      ],
    })
      .overrideProvider(InterviewsRepository)
      .useValue({
        findAll,
      })
      .overrideProvider(IdentifiersService)
      .useValue(IdentifiersServiceMock)
      .compile();

    findInterviewsCase = await module.get(FindInterviewsCase);
  });

  describe('when getting the list of interviews', () => {
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
        true,
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
        true,
        'Some long comment',
        true,
        new Date(),
        new Date(),
      );

      findAll.mockResolvedValue([interview]);
    });

    it('should return the interview', async () => {
      const items = (await findInterviewsCase.apply({
        creatorId: 'creatorId',
        from: new Date(),
        to: new Date(),
      })) as PlainInterview[];

      expect(items.length).toEqual(1);
    });
  });
});
