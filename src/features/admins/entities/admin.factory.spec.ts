import { Test } from '@nestjs/testing';

import { PasswordsService } from '@common/passwords';
import { IdentifiersService } from '@common/identifiers';
import { IdentifiersServiceMock, PasswordsServiceMock } from '@common/mocks';
import AdminFactory from './admin.factory';
import AdminEntity from './admin.entity';

describe('The AdminFactory', () => {
  let adminFactory: AdminFactory;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AdminFactory, PasswordsService, IdentifiersService],
    })
      .overrideProvider(PasswordsService)
      .useValue(PasswordsServiceMock)
      .overrideProvider(IdentifiersService)
      .useValue(IdentifiersServiceMock)
      .compile();

    adminFactory = await module.get(AdminFactory);
  });

  describe('when building admin', () => {
    it('should return instance of AdminEntity', async () => {
      const admin = await adminFactory.build({
        username: 'username',
        password: '1234567',
      });

      expect(admin).toBeInstanceOf(AdminEntity);
    });
  });
});
