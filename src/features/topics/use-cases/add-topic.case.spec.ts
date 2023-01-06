import { Test } from '@nestjs/testing';

import { IdentifiersService } from '@common/identifiers';
import { IdentifiersServiceMock } from '@common/mocks';
import AddTopicCase from './add-topic.case';
import TopicsRepository from '../topics.repository';
import { TopicFactory, TopicEntity } from '../entities';
import { NotUniqueLabelLanguageException } from '../exceptions';

describe('The AddTopicCase', () => {
  let addTopicCase: AddTopicCase;
  let create: jest.Mock;

  beforeEach(async () => {
    create = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        AddTopicCase,
        TopicFactory,
        TopicsRepository,
        IdentifiersService,
      ],
    })
      .overrideProvider(TopicsRepository)
      .useValue({
        create,
      })
      .overrideProvider(IdentifiersService)
      .useValue(IdentifiersServiceMock)
      .compile();

    addTopicCase = await module.get(AddTopicCase);
  });

  describe('when adding a topic', () => {
    describe('and the languages are unique', () => {
      let topic: TopicEntity;

      beforeEach(() => {
        topic = new TopicEntity(
          'id',
          [{ id: 'id', value: 'Computer Science', language: 'en' }],
          '000000',
          new Date(),
          new Date(),
        );

        create.mockResolvedValue(topic);
      });

      it('should return the topic', async () => {
        const result = await addTopicCase.apply({
          labels: [{ value: 'Computer Science', language: 'en' }],
          colorHex: '000000',
        });

        expect(result.id).toEqual(topic.id);
      });
    });

    describe('and the languages are not unique', () => {
      it('should throw the NotUniqueLabelLanguageException', async () => {
        await expect(
          addTopicCase.apply({
            labels: [
              { value: 'Computer Science', language: 'en' },
              { value: 'Science of Computers', language: 'en' },
            ],
            colorHex: '000000',
          }),
        ).rejects.toThrowError(NotUniqueLabelLanguageException);
      });
    });
  });
});
