import { Test } from '@nestjs/testing';

import { IdentifiersService } from '@common/identifiers';
import { IdentifiersServiceMock } from '@common/mocks';
import { UserEntity, UserFactory } from '@features/users/entities';
import { TopicFactory } from '@features/topics/entities';
import ReviewFactory from './review.factory';
import ReviewEntity from './review.entity';

describe('The ReviewFactory', () => {
  let reviewFactory: ReviewFactory;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ReviewFactory, IdentifiersService, UserFactory, TopicFactory],
    })
      .overrideProvider(IdentifiersService)
      .useValue(IdentifiersServiceMock)
      .compile();

    reviewFactory = await module.get(ReviewFactory);
  });

  describe('when building a review', () => {
    it('should return instance of ReviewEntity', async () => {
      const review = await reviewFactory.build({
        points: 5,
        comment: 'Nice person!',
        userId: 'userId',
        reviewer: new UserEntity(
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
          0,
          0,
          0,
          false,
          new Date(),
          new Date(),
        ),
      });

      expect(review).toBeInstanceOf(ReviewEntity);
    });
  });
});
