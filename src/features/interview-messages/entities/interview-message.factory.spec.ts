import { Test } from '@nestjs/testing';

import { IdentifiersService } from '@common/identifiers';
import { IdentifiersServiceMock } from '@common/mocks';
import InterviewMessageFactory from './interview-message.factory';
import InterviewMessageEntity from './interview-message.entity';

describe('The InterviewMessageFactory', () => {
  let interviewMessageFactory: InterviewMessageFactory;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [InterviewMessageFactory, IdentifiersService],
    })
      .overrideProvider(IdentifiersService)
      .useValue(IdentifiersServiceMock)
      .compile();

    interviewMessageFactory = await module.get(InterviewMessageFactory);
  });

  describe('when building an interview message', () => {
    it('should return instance of InterviewMessageEntity', async () => {
      const interviewMessage = await interviewMessageFactory.build({
        content: 'Hello!',
        interviewId: 'interviewId',
      });

      expect(interviewMessage).toBeInstanceOf(InterviewMessageEntity);
    });
  });
});
