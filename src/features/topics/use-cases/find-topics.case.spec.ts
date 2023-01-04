import { Test } from '@nestjs/testing';

import { IdentifiersService } from '@common/identifiers';
import { IdentifiersServiceMock } from '@common/mocks';
import FindTopicsCase from './find-topics.case';
import TopicsRepository from '../topics.repository';
import { TopicFactory, TopicEntity } from '../entities';

describe('The FindTopicsCase', () => {
  let findTopicsCase: FindTopicsCase;
  let findPaginated: jest.Mock;

  beforeEach(async () => {
    findPaginated = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        FindTopicsCase,
        TopicFactory,
        TopicsRepository,
        IdentifiersService,
      ],
    })
      .overrideProvider(TopicsRepository)
      .useValue({ findPaginated })
      .overrideProvider(IdentifiersService)
      .useValue(IdentifiersServiceMock)
      .compile();

    findTopicsCase = await module.get(FindTopicsCase);
  });

  describe('when getting the list of topics', () => {
    describe('and the topic exists', () => {
      let topic: TopicEntity;

      beforeEach(() => {
        topic = new TopicEntity(
          'id',
          [{ id: 'id', value: 'Computer Science', language: 'en' }],
          '000000',
          new Date(),
          new Date(),
        );

        findPaginated.mockResolvedValue({
          page: 1,
          pageSize: 10,
          totalItems: 1,
          items: [topic],
        });
      });

      it('should return the topic', async () => {
        const result = await findTopicsCase.apply({});

        expect(result.items.length).toEqual(1);
      });
    });
  });
});
