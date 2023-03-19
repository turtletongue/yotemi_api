import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';

import { PasswordsService } from '@common/passwords';
import { IdentifiersService } from '@common/identifiers';
import { IdentifiersServiceMock, PasswordsServiceMock } from '@common/mocks';
import { TopicFactory } from '@features/topics/entities';
import CheckUserAuthIdCase from './check-user-auth-id.case';
import UsersRepository from '../users.repository';
import { UserEntity, UserFactory } from '../entities';

describe('The CheckUserAuthIdCase', () => {
  let checkUserAuthIdCase: CheckUserAuthIdCase;
  let findByAccountAddress: jest.Mock;
  let update: jest.Mock;

  beforeEach(async () => {
    findByAccountAddress = jest.fn();
    update = jest.fn();

    const module = await Test.createTestingModule({
      providers: [
        CheckUserAuthIdCase,
        UserFactory,
        UsersRepository,
        PasswordsService,
        IdentifiersService,
        TopicFactory,
      ],
    })
      .overrideProvider(UsersRepository)
      .useValue({
        findByAccountAddress,
        update,
      })
      .overrideProvider(PasswordsService)
      .useValue(PasswordsServiceMock)
      .overrideProvider(IdentifiersService)
      .useValue(IdentifiersServiceMock)
      .compile();

    checkUserAuthIdCase = await module.get(CheckUserAuthIdCase);
  });

  describe('when checking user authId', () => {
    describe('and the authId correct', () => {
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
          new Date(),
          new Date(),
        );

        findByAccountAddress.mockResolvedValue(user);
        update.mockResolvedValue(
          new UserEntity(
            'id',
            'tom',
            '0:910ccf61e24dd425d39e3cfbb25f8d260a0038bf181ee43739be3051f1d8db10',
            'updatedAuthId',
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
            new Date(),
            new Date(),
          ),
        );
      });

      it('should return the user', async () => {
        const result = await checkUserAuthIdCase.apply({
          accountAddress:
            '0:910ccf61e24dd425d39e3cfbb25f8d260a0038bf181ee43739be3051f1d8db10',
          authId: 'authId',
        });

        expect(result.id).toEqual(user.id);
      });

      it('should update authId', async () => {
        const result = await checkUserAuthIdCase.apply({
          accountAddress:
            '0:910ccf61e24dd425d39e3cfbb25f8d260a0038bf181ee43739be3051f1d8db10',
          authId: 'authId',
        });

        expect(result.authId).not.toEqual(user.authId);
      });
    });

    describe('and the auth id incorrect', () => {
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
          new Date(),
          new Date(),
        );

        findByAccountAddress.mockResolvedValue(user);
        update.mockResolvedValue(user);
      });

      it('should throw the UnauthorizedException', async () => {
        await expect(
          checkUserAuthIdCase.apply({
            accountAddress:
              '0:910ccf61e24dd425d39e3cfbb25f8d260a0038bf181ee43739be3051f1d8db10',
            authId: 'incorrectAuthId',
          }),
        ).rejects.toThrowError(UnauthorizedException);
      });
    });
  });
});
