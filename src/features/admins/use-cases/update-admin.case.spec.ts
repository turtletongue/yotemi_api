import { Test } from '@nestjs/testing';

import { PasswordsService } from '@common/passwords';
import { IdentifiersService } from '@common/identifiers';
import { IdentifiersServiceMock, PasswordsServiceMock } from '@common/mocks';
import UpdateAdminCase from './update-admin.case';
import AdminsRepository from '../admins.repository';
import { UsernameIsTakenException } from '../exceptions';
import { AdminFactory, AdminEntity } from '../entities';

describe('The UpdateAdminCase', () => {
  let updateAdminCase: UpdateAdminCase;
  let isUsernameTaken: jest.Mock;
  let findById: jest.Mock;
  let update: jest.Mock;

  beforeEach(async () => {
    isUsernameTaken = jest.fn();
    findById = jest.fn();
    update = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        UpdateAdminCase,
        AdminFactory,
        AdminsRepository,
        PasswordsService,
        IdentifiersService,
      ],
    })
      .overrideProvider(AdminsRepository)
      .useValue({
        update,
        findById,
        isUsernameTaken,
      })
      .overrideProvider(PasswordsService)
      .useValue(PasswordsServiceMock)
      .overrideProvider(IdentifiersService)
      .useValue(IdentifiersServiceMock)
      .compile();

    updateAdminCase = await module.get(UpdateAdminCase);
  });

  describe('when editing an admin', () => {
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

        update.mockResolvedValue(admin);
        findById.mockResolvedValue(admin);
        isUsernameTaken.mockResolvedValue(false);
      });

      it('should return the admin', async () => {
        const result = await updateAdminCase.apply({
          id: 'id',
          username: 'username',
        });

        expect(result.id).toEqual(admin.getId());
      });

      it('should not return the password', async () => {
        const result = await updateAdminCase.apply({
          id: 'id',
          username: 'username',
        });

        expect('password' in result).toBe(false);
      });
    });

    describe('and the username is taken', () => {
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

        findById.mockResolvedValue(admin);
        isUsernameTaken.mockResolvedValue(true);
      });

      it('should throw the UsernameIsTakenException', async () => {
        await expect(
          updateAdminCase.apply({ id: 'id', username: 'username' }),
        ).rejects.toThrowError(UsernameIsTakenException);
      });
    });
  });
});
