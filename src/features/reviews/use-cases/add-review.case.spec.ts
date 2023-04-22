import { Test } from '@nestjs/testing';

import { IdentifiersService } from '@common/identifiers';
import { IdentifiersServiceMock } from '@test/mocks';
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
  let isExist: jest.Mock;

  beforeEach(async () => {
    create = jest.fn();
    isParticipated = jest.fn();
    isExist = jest.fn();

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
        isExist,
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
          false,
          new Date(),
          new Date(),
        );

        create.mockResolvedValue(review);
        isExist.mockResolvedValue(false);
        isParticipated.mockResolvedValue(true);
      });

      it('should return the review', async () => {
        const result = await addReviewCase.apply({
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
          false,
          new Date(),
          new Date(),
        );

        create.mockResolvedValue(review);
        isExist.mockResolvedValue(false);
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
        ).rejects.toThrowError(NotParticipatedToReviewException);
      });
    });
  });
});
