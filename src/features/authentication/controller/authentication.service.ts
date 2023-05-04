import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import WalletAuthenticationService from '@common/ton/wallet-authentication.service';
import AuthenticateUserDto from '@features/authentication/controller/dto/authenticate-user.dto';
import CheckAdminPasswordCase from '@features/admins/use-cases/check-admin-password.case';
import { AdminNotFoundException } from '@features/admins/exceptions';
import { UserNotFoundException } from '@features/users/exceptions';
import CheckUserAuthIdCase from '@features/users/use-cases/check-user-auth-id.case';
import UsersRepository from '@features/users/users.repository';
import AdminsRepository from '@features/admins/admins.repository';
import AuthenticationResultDto from './dto/authentication-result.dto';
import AuthenticateAdminDto from './dto/authenticate-admin.dto';
import RefreshTokensService from './refresh-tokens.service';

@Injectable()
export default class AuthenticationService {
  constructor(
    private readonly jwt: JwtService,
    private readonly checkAdminPasswordCase: CheckAdminPasswordCase,
    private readonly checkUserAuthIdCase: CheckUserAuthIdCase,
    private readonly refreshTokens: RefreshTokensService,
    private readonly ton: WalletAuthenticationService,
    private readonly usersRepository: UsersRepository,
    private readonly adminsRepository: AdminsRepository,
  ) {}

  public async authenticateAdmin(
    dto: AuthenticateAdminDto,
  ): Promise<AuthenticationResultDto> {
    try {
      const admin = await this.checkAdminPasswordCase.apply(dto);

      const accessToken = await this.jwt.signAsync({
        kind: 'admin',
        executorId: admin.id,
        executor: {
          id: admin.id,
          username: admin.username,
        },
      });

      return {
        accessToken,
        admin,
      };
    } catch (error: unknown) {
      if (error instanceof AdminNotFoundException) {
        throw new UnauthorizedException();
      }

      throw error;
    }
  }

  public async authenticateUser(
    dto: AuthenticateUserDto,
  ): Promise<AuthenticationResultDto> {
    try {
      const user = await this.checkUserAuthIdCase.apply({
        accountAddress: dto.accountAddress,
        authId: dto.signature.payload,
      });

      if (user.isBlocked) {
        throw new UnauthorizedException();
      }

      const isSignatureValid = await this.ton.verifySignature(
        user.accountAddress,
        dto.signature,
      );

      if (!isSignatureValid) {
        throw new UnauthorizedException();
      }

      const accessToken = await this.jwt.signAsync({
        kind: 'user',
        executorId: user.id,
        executor: {
          id: user.id,
          followingsIds: user.followingsIds,
        },
      });

      return {
        accessToken,
        user,
      };
    } catch (error: unknown) {
      if (error instanceof UserNotFoundException) {
        throw new UnauthorizedException();
      }

      throw error;
    }
  }

  public async revokeRefreshToken(token: string): Promise<string> {
    const { tokenId, executorId, kind } = await this.refreshTokens.getPayload(
      token,
    );

    const tokensKey = this.refreshTokens.getTokensListKey(executorId, kind);
    const tokens = await this.refreshTokens.getTokens(tokensKey);
    await this.refreshTokens.saveValidTokens(
      tokensKey,
      tokens.filter((token) => token.id !== tokenId),
    );

    const cookiePrefix = kind === 'admin' ? 'Admin' : 'User';

    return `${cookiePrefix}Refresh=; HttpOnly; Path=/; Max-Age=0`;
  }

  public async refreshAccess(refreshToken: string): Promise<string> {
    const { executorId, kind } = await this.refreshTokens.getPayload(
      refreshToken,
    );

    const userFollowingsIds =
      kind === 'user'
        ? await this.usersRepository.findFollowingIds(executorId)
        : null;

    const admin =
      kind === 'admin'
        ? await this.adminsRepository.findById(executorId)
        : null;

    return await this.jwt.signAsync({
      executorId,
      kind,
      ...(userFollowingsIds && {
        executor: {
          id: executorId,
          followingsIds: userFollowingsIds,
        },
      }),
      ...(admin && {
        executor: {
          id: executorId,
          username: admin.username,
        },
      }),
    });
  }
}
