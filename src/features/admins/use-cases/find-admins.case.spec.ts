import { Test } from '@nestjs/testing';

import { PasswordsService } from '@common/passwords';
import { IdentifiersService } from '@common/identifiers';
import { IdentifiersServiceMock, PasswordsServiceMock } from '@test/mocks';
import FindAdminsCase from './find-admins.case';
import AdminsRepository from '../admins.repository';
import { AdminFactory, AdminEntity } from '../entities';

describe('The FindAdminsCase', () => {
  let findAdminsCase: FindAdminsCase;
  let findPaginated: jest.Mock;

  beforeEach(async () => {
    findPaginated = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        FindAdminsCase,
        AdminFactory,
        AdminsRepository,
        PasswordsService,
        IdentifiersService,
      ],
    })
      .overrideProvider(AdminsRepository)
      .useValue({
        findPaginated,
      })
      .overrideProvider(PasswordsService)
      .useValue(PasswordsServiceMock)
      .overrideProvider(IdentifiersService)
      .useValue(IdentifiersServiceMock)
      .compile();

    findAdminsCase = await module.get(FindAdminsCase);
  });

  describe('when getting the list of admins', () => {
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

        findPaginated.mockResolvedValue({
          page: 1,
          pageSize: 10,
          totalItems: 1,
          items: [admin],
        });
      });

      it('should return the admin', async () => {
        const result = await findAdminsCase.apply({});

        expect(result.items.length).toEqual(1);
      });

      it('should not return the password', async () => {
        const result = await findAdminsCase.apply({});

        result.items.forEach((item) => expect('password' in item).toBe(false));
      });
    });
  });
});
