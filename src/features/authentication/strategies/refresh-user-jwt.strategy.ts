import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigType } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import jwtConfig from '@config/jwt.config';
import UsersRepository from '@features/users/users.repository';
import { UserEntity } from '@features/users/entities';
import { UserNotFoundException } from '@features/users/exceptions';
import RefreshTokensService from '../controller/refresh-tokens.service';
import { RefreshTokenPayload } from '../types';

@Injectable()
export default class RefreshUserJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-user',
) {
  constructor(
    @Inject(jwtConfig.KEY) config: ConfigType<typeof jwtConfig>,
    private readonly refreshTokens: RefreshTokensService,
    private readonly usersRepository: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request.cookies?.UserRefresh;
        },
      ]),
      secretOrKey: config.refresh.secret,
      ignoreExpiration: false,
    });
  }

  public async validate({
    tokenId,
    executorId,
  }: RefreshTokenPayload): Promise<UserEntity> {
    try {
      const tokensKey = this.refreshTokens.getTokensListKey(executorId, 'user');
      const tokens = await this.refreshTokens.getTokens(tokensKey);

      if (!tokens.find((token) => token.id === tokenId)) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.usersRepository.findById(executorId);
    } catch (error: unknown) {
      if (error instanceof UserNotFoundException) {
        throw new UnauthorizedException();
      }

      throw error;
    }
  }
}
