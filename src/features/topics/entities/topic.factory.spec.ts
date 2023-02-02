import { Test } from '@nestjs/testing';

import { IdentifiersService } from '@common/identifiers';
import { IdentifiersServiceMock } from '@common/mocks';
import TopicFactory from './topic.factory';
import TopicEntity from './topic.entity';

describe('The TopicFactory', () => {
  let topicFactory: TopicFactory;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TopicFactory, IdentifiersService],
    })
      .overrideProvider(IdentifiersService)
      .useValue(IdentifiersServiceMock)
      .compile();

    topicFactory = await module.get(TopicFactory);
  });

  describe('when building a topic', () => {
    it('should return instance of TopicEntity', async () => {
      const topic = await topicFactory.build({
        labels: [{ value: 'Computer Science', language: 'en' }],
        colorHex: '000000',
        isModerated: true,
      });

      expect(topic).toBeInstanceOf(TopicEntity);
    });
  });
});
