import { Test } from '@nestjs/testing';

import { PasswordsService } from '@common/passwords';
import { IdentifiersService } from '@common/identifiers';
import { IdentifiersServiceMock, PasswordsServiceMock } from '@common/mocks';
import UpdateUserCase from './update-user.case';
import UsersRepository from '../users.repository';
import { UserEntity, UserFactory } from '../entities';

describe('The UpdateUserCase', () => {
  let updateUserCase: UpdateUserCase;
  let findById: jest.Mock;
  let update: jest.Mock;

  beforeEach(async () => {
    findById = jest.fn();
    update = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        UpdateUserCase,
        UserFactory,
        UsersRepository,
        PasswordsService,
        IdentifiersService,
      ],
    })
      .overrideProvider(UsersRepository)
      .useValue({
        findById,
        update,
      })
      .overrideProvider(PasswordsService)
      .useValue(PasswordsServiceMock)
      .overrideProvider(IdentifiersService)
      .useValue(IdentifiersServiceMock)
      .compile();

    updateUserCase = await module.get(UpdateUserCase);
  });

  describe('when updating user', () => {
    let user: UserEntity;

    beforeEach(() => {
      user = new UserEntity(
        'id',
        '0:910ccf61e24dd425d39e3cfbb25f8d260a0038bf181ee43739be3051f1d8db10',
        'authId',
        'Tom Land',
        '',
        false,
        new Date(),
        new Date(),
      );

      findById.mockResolvedValue(user);
      update.mockResolvedValue(user);
    });

    it('should return the user', async () => {
      const result = await updateUserCase.apply({
        id: 'id',
        fullName: 'Tom Land',
        executor: user,
      });

      expect(result.id).toEqual(user.getId());
    });
  });
});
