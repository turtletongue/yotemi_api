import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';

import { PasswordsService } from '@common/passwords';
import { IdentifiersService } from '@common/identifiers';
import { IdentifiersServiceMock, PasswordsServiceMock } from '@common/mocks';
import CheckAdminPasswordCase from './check-admin-password.case';
import AdminsRepository from '../admins.repository';
import { AdminFactory, AdminEntity } from '../entities';

describe('The CheckAdminPasswordCase', () => {
  let checkAdminPasswordCase: CheckAdminPasswordCase;
  let findByUsername: jest.Mock;

  beforeEach(async () => {
    findByUsername = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        CheckAdminPasswordCase,
        AdminFactory,
        AdminsRepository,
        PasswordsService,
        IdentifiersService,
      ],
    })
      .overrideProvider(AdminsRepository)
      .useValue({
        findByUsername,
      })
      .overrideProvider(PasswordsService)
      .useValue(PasswordsServiceMock)
      .overrideProvider(IdentifiersService)
      .useValue(IdentifiersServiceMock)
      .compile();

    checkAdminPasswordCase = await module.get(CheckAdminPasswordCase);
  });

  describe('when checking password for the admin', () => {
    describe('and the passwords are match', () => {
      let admin: AdminEntity;

      beforeEach(() => {
        admin = new AdminEntity(
          'id',
          'username',
          'passwordHash',
          new Date(),
          new Date(),
          () => Promise.resolve(true),
        );

        findByUsername.mockResolvedValue(admin);
      });

      it('should return the admin', async () => {
        const result = await checkAdminPasswordCase.apply({
          username: 'username',
          password: 'password',
        });

        expect(result.id).toEqual(admin.id);
      });

      it('should not return the password', async () => {
        const result = await checkAdminPasswordCase.apply({
          username: 'username',
          password: 'password',
        });

        expect('password' in result).toBe(false);
      });
    });

    describe('and the passwords are not match', () => {
      let admin: AdminEntity;

      beforeEach(() => {
        admin = new AdminEntity(
          'id',
          'username',
          'passwordHash',
          new Date(),
          new Date(),
          () => Promise.resolve(false),
        );

        findByUsername.mockResolvedValue(admin);
      });

      it('should throw the UnauthorizedException', async () => {
        await expect(
          checkAdminPasswordCase.apply({
            username: 'username',
            password: 'password',
          }),
        ).rejects.toThrowError(UnauthorizedException);
      });
    });
  });
});
