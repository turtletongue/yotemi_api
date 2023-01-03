import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigType } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import jwtConfig from '@config/jwt.config';
import AdminsRepository from '@features/admins/admins.repository';
import { AdminEntity } from '@features/admins/entities';
import { AdminNotFoundException } from '@features/admins/exceptions';
import UsersRepository from '@features/users/users.repository';
import { UserEntity } from '@features/users/entities';
import { UserNotFoundException } from '@features/users/exceptions';
import RefreshTokensService from '../controller/refresh-tokens.service';
import { RefreshTokenPayload } from '../types';

@Injectable()
export default class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh',
) {
  constructor(
    @Inject(jwtConfig.KEY) config: ConfigType<typeof jwtConfig>,
    private readonly refreshTokens: RefreshTokensService,
    private readonly adminsRepository: AdminsRepository,
    private readonly usersRepository: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request.cookies?.Refresh;
        },
      ]),
      secretOrKey: config.refresh.secret,
      ignoreExpiration: false,
    });
  }

  public async validate({
    tokenId,
    kind,
    executorId,
  }: RefreshTokenPayload): Promise<AdminEntity | UserEntity> {
    try {
      const tokensKey = this.refreshTokens.getTokensListKey(executorId, kind);
      const tokens = await this.refreshTokens.getTokens(tokensKey);

      if (!tokens.find((token) => token.id === tokenId)) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (kind === 'admin') {
        return this.adminsRepository.findById(executorId);
      }

      return this.usersRepository.findById(executorId);
    } catch (error: unknown) {
      if (
        error instanceof AdminNotFoundException ||
        error instanceof UserNotFoundException
      ) {
        throw new UnauthorizedException();
      }

      throw error;
    }
  }
}
