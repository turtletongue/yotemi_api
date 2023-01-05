import { Test } from '@nestjs/testing';

import { PasswordsService } from '@common/passwords';
import { IdentifiersService } from '@common/identifiers';
import { IdentifiersServiceMock, PasswordsServiceMock } from '@common/mocks';
import { TopicFactory } from '@features/topics/entities';
import UserFactory from './user.factory';
import UserEntity from './user.entity';

describe('The UserFactory', () => {
  let userFactory: UserFactory;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserFactory,
        PasswordsService,
        IdentifiersService,
        TopicFactory,
      ],
    })
      .overrideProvider(PasswordsService)
      .useValue(PasswordsServiceMock)
      .overrideProvider(IdentifiersService)
      .useValue(IdentifiersServiceMock)
      .compile();

    userFactory = await module.get(UserFactory);
  });

  describe('when building a user', () => {
    it('should return instance of UserEntity', async () => {
      const user = await userFactory.build({
        accountAddress:
          '0:910ccf61e24dd425d39e3cfbb25f8d260a0038bf181ee43739be3051f1d8db10',
        fullName: 'Tom Land',
      });

      expect(user).toBeInstanceOf(UserEntity);
    });
  });
});
