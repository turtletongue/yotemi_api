import { Test } from '@nestjs/testing';

import { IdentifiersService } from '@common/identifiers';
import { IdentifiersServiceMock } from '@common/mocks';
import { UserEntity, UserFactory } from '@features/users/entities';
import { TopicFactory } from '@features/topics/entities';
import InterviewsRepository from '@features/interviews/interviews.repository';
import AddReviewCase from './add-review.case';
import ReviewsRepository from '../reviews.repository';
import { ReviewFactory, ReviewEntity } from '../entities';
import { NotParticipatedToReviewException } from '../exceptions';

describe('The AddReviewCase', () => {
  let addReviewCase: AddReviewCase;
  let create: jest.Mock;
  let isParticipated: jest.Mock;

  beforeEach(async () => {
    create = jest.fn();
    isParticipated = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        AddReviewCase,
        ReviewFactory,
        ReviewsRepository,
        IdentifiersService,
        UserFactory,
        TopicFactory,
        InterviewsRepository,
      ],
    })
      .overrideProvider(ReviewsRepository)
      .useValue({
        create,
      })
      .overrideProvider(InterviewsRepository)
      .useValue({
        isParticipated,
      })
      .overrideProvider(IdentifiersService)
      .useValue(IdentifiersServiceMock)
      .compile();

    addReviewCase = await module.get(AddReviewCase);
  });

  describe('when adding a review', () => {
    describe("and reviewer is participated in user's interview", () => {
      let review: ReviewEntity;

      beforeEach(() => {
        review = new ReviewEntity(
          'id',
          5,
          'Nice person!',
          'userId',
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
          new Date(),
          new Date(),
        );

        create.mockResolvedValue(review);
        isParticipated.mockResolvedValue(true);
      });

      it('should return the review', async () => {
        const result = await addReviewCase.apply({
          points: 5,
          comment: 'Nice person!',
          userId: 'userId',
          reviewer: new UserEntity(
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

        expect(result.id).toEqual(result.id);
      });
    });

    describe("and reviewer is not participated in user's interview", () => {
      let review: ReviewEntity;

      beforeEach(() => {
        review = new ReviewEntity(
          'id',
          5,
          'Nice person!',
          'userId',
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
          new Date(),
          new Date(),
        );

        create.mockResolvedValue(review);
        isParticipated.mockResolvedValue(false);
      });

      it('should throw the NotParticipatedToReviewException', async () => {
        await expect(
          addReviewCase.apply({
            points: 5,
            comment: 'Nice person!',
            userId: 'userId',
            reviewer: new UserEntity(
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
          }),
        ).rejects.toThrowError(NotParticipatedToReviewException);
      });
    });
  });
});
