import { Test } from '@nestjs/testing';

import { PasswordsService } from '@common/passwords';
import { IdentifiersService } from '@common/identifiers';
import { IdentifiersServiceMock, PasswordsServiceMock } from '@test/mocks';
import AddAdminCase from './add-admin.case';
import AdminsRepository from '../admins.repository';
import { UsernameIsTakenException } from '../exceptions';
import { AdminFactory, AdminEntity } from '../entities';

describe('The AddAdminCase', () => {
  let addAdminCase: AddAdminCase;
  let isUsernameTaken: jest.Mock;
  let create: jest.Mock;

  beforeEach(async () => {
    isUsernameTaken = jest.fn();
    create = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        AddAdminCase,
        AdminFactory,
        AdminsRepository,
        PasswordsService,
        IdentifiersService,
      ],
    })
      .overrideProvider(AdminsRepository)
      .useValue({
        isUsernameTaken,
        create,
      })
      .overrideProvider(PasswordsService)
      .useValue(PasswordsServiceMock)
      .overrideProvider(IdentifiersService)
      .useValue(IdentifiersServiceMock)
      .compile();

    addAdminCase = await module.get(AddAdminCase);
  });

  describe('when adding an admin', () => {
    describe('and the username is not taken', () => {
      let admin: AdminEntity;

      beforeEach(() => {
        admin = new AdminEntity(
          'id',
          'username',
          'passwordHash',
          new Date(),
          new Date(),
          jest.fn(),
        );

        create.mockResolvedValue(admin);
        isUsernameTaken.mockResolvedValue(false);
      });

      it('should return the admin', async () => {
        const result = await addAdminCase.apply({
          username: 'username',
          password: 'password',
        });

        expect(result.id).toEqual(admin.id);
      });

      it('should not return the password', async () => {
        const result = await addAdminCase.apply({
          username: 'username',
          password: 'password',
        });

        expect('password' in result).toBe(false);
      });
    });

    describe('and the username is taken', () => {
      beforeEach(() => {
        isUsernameTaken.mockResolvedValue(true);
      });

      it('should throw the UsernameIsTakenException', async () => {
        await expect(
          addAdminCase.apply({ username: 'username', password: 'password' }),
        ).rejects.toThrowError(UsernameIsTakenException);
      });
    });
  });
});
