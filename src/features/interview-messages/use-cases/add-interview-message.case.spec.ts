import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';

import { IdentifiersService } from '@common/identifiers';
import { IdentifiersServiceMock } from '@common/mocks';
import InterviewsRepository from '@features/interviews/interviews.repository';
import { InterviewEntity } from '@features/interviews/entities';
import { UserEntity } from '@features/users/entities';
import AddInterviewMessageCase from './add-interview-message.case';
import InterviewMessagesRepository from '../interview-messages.repository';
import { InterviewMessageFactory, InterviewMessageEntity } from '../entities';
import { InvalidMessagesInterviewStatusException } from '../exceptions';

describe('The AddInterviewMessageCase', () => {
  let addInterviewMessageCase: AddInterviewMessageCase;
  let create: jest.Mock;
  let findInterviewById: jest.Mock;

  beforeEach(async () => {
    create = jest.fn();
    findInterviewById = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        AddInterviewMessageCase,
        InterviewMessageFactory,
        InterviewMessagesRepository,
        IdentifiersService,
        InterviewsRepository,
      ],
    })
      .overrideProvider(InterviewMessagesRepository)
      .useValue({
        create,
      })
      .overrideProvider(InterviewsRepository)
      .useValue({
        findById: findInterviewById,
      })
      .overrideProvider(IdentifiersService)
      .useValue(IdentifiersServiceMock)
      .compile();

    addInterviewMessageCase = await module.get(AddInterviewMessageCase);
  });

  describe('when adding an interview message', () => {
    describe('and author of message is participant of the interview', () => {
      let interviewMessage: InterviewMessageEntity;
      let participant: UserEntity;

      beforeEach(() => {
        interviewMessage = new InterviewMessageEntity(
          'id',
          'Hello!',
          'authorId',
          'interviewId',
          new Date(),
          new Date(),
        );

        participant = new UserEntity(
          'participantId',
          '0:910ccf61e24dd425d39e3cfbb25f8d260a0038bf181ee43739be3051f1d8db10',
          'authId',
          'Tom Land',
          '',
          false,
          [],
          0,
          new Date(),
          new Date(),
        );

        create.mockResolvedValue(interviewMessage);
        findInterviewById.mockResolvedValue(
          new InterviewEntity(
            'interviewId',
            0.001,
            new Date(),
            new Date(),
            'started',
            'creatorId',
            participant,
            '',
            new Date(),
            new Date(),
          ),
        );
      });

      it('should return the interview message', async () => {
        const result = await addInterviewMessageCase.apply({
          content: 'Hello!',
          interviewId: 'interviewId',
          executor: participant,
        });

        expect(result.id).toEqual(interviewMessage.id);
      });
    });

    describe('and the interview is not started', () => {
      let interviewMessage: InterviewMessageEntity;
      let participant: UserEntity;

      beforeEach(() => {
        interviewMessage = new InterviewMessageEntity(
          'id',
          'Hello!',
          'authorId',
          'interviewId',
          new Date(),
          new Date(),
        );

        participant = new UserEntity(
          'participantId',
          '0:910ccf61e24dd425d39e3cfbb25f8d260a0038bf181ee43739be3051f1d8db10',
          'authId',
          'Tom Land',
          '',
          false,
          [],
          0,
          new Date(),
          new Date(),
        );

        create.mockResolvedValue(interviewMessage);
        findInterviewById.mockResolvedValue(
          new InterviewEntity(
            'interviewId',
            0.001,
            new Date(),
            new Date(),
            'finished',
            'creatorId',
            participant,
            '',
            new Date(),
            new Date(),
          ),
        );
      });

      it('should throw the InvalidMessagesInterviewStatusException', async () => {
        await expect(
          addInterviewMessageCase.apply({
            content: 'Hello!',
            interviewId: 'interviewId',
            executor: participant,
          }),
        ).rejects.toThrowError(InvalidMessagesInterviewStatusException);
      });
    });

    describe('and author of message is not participant of the interview', () => {
      let interviewMessage: InterviewMessageEntity;
      let executor: UserEntity;

      beforeEach(() => {
        interviewMessage = new InterviewMessageEntity(
          'id',
          'Hello!',
          'authorId',
          'interviewId',
          new Date(),
          new Date(),
        );

        executor = new UserEntity(
          'participantId',
          '0:910ccf61e24dd425d39e3cfbb25f8d260a0038bf181ee43739be3051f1d8db10',
          'authId',
          'Tom Land',
          '',
          false,
          [],
          0,
          new Date(),
          new Date(),
        );

        create.mockResolvedValue(interviewMessage);
        findInterviewById.mockResolvedValue(
          new InterviewEntity(
            'interviewId',
            0.001,
            new Date(),
            new Date(),
            'started',
            'creatorId',
            null,
            '',
            new Date(),
            new Date(),
          ),
        );
      });

      it('should throw the UnauthorizedException', async () => {
        await expect(
          addInterviewMessageCase.apply({
            content: 'Hello!',
            interviewId: 'interviewId',
            executor,
          }),
        ).rejects.toThrowError(UnauthorizedException);
      });
    });
  });
});
