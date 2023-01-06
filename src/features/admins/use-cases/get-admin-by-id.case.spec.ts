import { Test } from '@nestjs/testing';

import { PasswordsService } from '@common/passwords';
import { IdentifiersService } from '@common/identifiers';
import { IdentifiersServiceMock, PasswordsServiceMock } from '@common/mocks';
import GetAdminByIdCase from './get-admin-by-id.case';
import AdminsRepository from '../admins.repository';
import { AdminFactory, AdminEntity } from '../entities';

describe('The GetAdminByIdCase', () => {
  let getAdminByIdCase: GetAdminByIdCase;
  let findById: jest.Mock;

  beforeEach(async () => {
    findById = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        GetAdminByIdCase,
        AdminFactory,
        AdminsRepository,
        PasswordsService,
        IdentifiersService,
      ],
    })
      .overrideProvider(AdminsRepository)
      .useValue({
        findById,
      })
      .overrideProvider(PasswordsService)
      .useValue(PasswordsServiceMock)
      .overrideProvider(IdentifiersService)
      .useValue(IdentifiersServiceMock)
      .compile();

    getAdminByIdCase = await module.get(GetAdminByIdCase);
  });

  describe('when getting an admin', () => {
    describe('and the admin exists', () => {
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
      });

      it('should return the admin', async () => {
        const result = await getAdminByIdCase.apply('id');

        expect(result.id).toEqual(admin.id);
      });

      it('should not return the password', async () => {
        const result = await getAdminByIdCase.apply('id');

        expect('password' in result).toBe(false);
      });
    });
  });
});
