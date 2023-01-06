import { Test } from '@nestjs/testing';

import { PasswordsService } from '@common/passwords';
import { IdentifiersService } from '@common/identifiers';
import { IdentifiersServiceMock, PasswordsServiceMock } from '@common/mocks';
import { TopicFactory } from '@features/topics/entities';
import TopicsRepository from '@features/topics/topics.repository';
import AddUserCase from './add-user.case';
import UsersRepository from '../users.repository';
import { UserEntity, UserFactory } from '../entities';
import { AddressIsTakenException } from '../exceptions';

describe('The AddUserCase', () => {
  let addUserCase: AddUserCase;
  let isAccountAddressTaken: jest.Mock;
  let create: jest.Mock;

  beforeEach(async () => {
    isAccountAddressTaken = jest.fn();
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

        create.mockResolvedValue(user);
        isAccountAddressTaken.mockResolvedValue(false);
      });

      it('should return the user', async () => {
        const result = await addUserCase.apply({
          accountAddress:
            '0:910ccf61e24dd425d39e3cfbb25f8d260a0038bf181ee43739be3051f1d8db10',
          fullName: 'Tom Land',
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
            accountAddress:
              '0:910ccf61e24dd425d39e3cfbb25f8d260a0038bf181ee43739be3051f1d8db10',
            fullName: 'Tom Land',
          }),
        ).rejects.toThrowError(AddressIsTakenException);
      });
    });
  });
});
