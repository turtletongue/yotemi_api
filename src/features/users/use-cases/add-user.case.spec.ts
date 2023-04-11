import { Test } from '@nestjs/testing';

import { PasswordsService } from '@common/passwords';
import { IdentifiersService } from '@common/identifiers';
import { IdentifiersServiceMock, PasswordsServiceMock } from '@test/mocks';
import { TopicFactory } from '@features/topics/entities';
import TopicsRepository from '@features/topics/topics.repository';
import AddUserCase from './add-user.case';
import UsersRepository from '../users.repository';
import { UserEntity, UserFactory } from '../entities';
import { AddressIsTakenException } from '../exceptions';

describe('The AddUserCase', () => {
  let addUserCase: AddUserCase;
  let isAccountAddressTaken: jest.Mock;
  let isUsernameTaken: jest.Mock;
  let create: jest.Mock;

  beforeEach(async () => {
    isAccountAddressTaken = jest.fn();
    isUsernameTaken = jest.fn();
    create = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        AddUserCase,
        UserFactory,
        UsersRepository,
        PasswordsService,
        IdentifiersService,
        TopicFactory,
        TopicsRepository,
      ],
    })
      .overrideProvider(UsersRepository)
      .useValue({
        isAccountAddressTaken,
        isUsernameTaken,
        create,
      })
      .overrideProvider(TopicsRepository)
      .useValue({
        findByIds: () => Promise.resolve([]),
      })
      .overrideProvider(PasswordsService)
      .useValue(PasswordsServiceMock)
      .overrideProvider(IdentifiersService)
      .useValue(IdentifiersServiceMock)
      .compile();

    addUserCase = await module.get(AddUserCase);
  });

  describe('when adding user', () => {
    describe('and the account address is not taken', () => {
      let user: UserEntity;

      beforeEach(() => {
        user = new UserEntity(
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
          false,
          new Date(),
          new Date(),
        );

        create.mockResolvedValue(user);
        isAccountAddressTaken.mockResolvedValue(false);
        isUsernameTaken.mockResolvedValue(false);
      });

      it('should return the user', async () => {
        const result = await addUserCase.apply({
          username: 'tom',
          accountAddress:
            '0:910ccf61e24dd425d39e3cfbb25f8d260a0038bf181ee43739be3051f1d8db10',
          firstName: 'Tom',
          lastName: 'Land',
        });

        expect(result.id).toEqual(user.id);
      });
    });

    describe('and the account address is taken', () => {
      beforeEach(() => {
        isAccountAddressTaken.mockResolvedValue(true);
      });

      it('should throw the AddressIsTakenException', async () => {
        await expect(
          addUserCase.apply({
            username: 'tom',
            accountAddress:
              '0:910ccf61e24dd425d39e3cfbb25f8d260a0038bf181ee43739be3051f1d8db10',
            firstName: 'Tom',
            lastName: 'Land',
          }),
        ).rejects.toThrowError(AddressIsTakenException);
      });
    });
  });
});
