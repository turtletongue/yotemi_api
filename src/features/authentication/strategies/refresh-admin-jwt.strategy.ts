import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigType } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import jwtConfig from '@config/jwt.config';
import AdminsRepository from '@features/admins/admins.repository';
import { AdminEntity } from '@features/admins/entities';
import { AdminNotFoundException } from '@features/admins/exceptions';
import RefreshTokensService from '../controller/refresh-tokens.service';
import { RefreshTokenPayload } from '../types';

@Injectable()
export default class RefreshAdminJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-admin',
) {
  constructor(
    @Inject(jwtConfig.KEY) config: ConfigType<typeof jwtConfig>,
    private readonly refreshTokens: RefreshTokensService,
    private readonly adminsRepository: AdminsRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request.cookies?.AdminRefresh;
        },
      ]),
      secretOrKey: config.refresh.secret,
      ignoreExpiration: false,
    });
  }

  public async validate({
    tokenId,
    executorId,
  }: RefreshTokenPayload): Promise<AdminEntity> {
    try {
      const tokensKey = this.refreshTokens.getTokensListKey(
        executorId,
        'admin',
      );
      const tokens = await this.refreshTokens.getTokens(tokensKey);

      if (!tokens.find((token) => token.id === tokenId)) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.adminsRepository.findById(executorId);
    } catch (error: unknown) {
      if (error instanceof AdminNotFoundException) {
        throw new UnauthorizedException();
      }

      throw error;
    }
  }
}
