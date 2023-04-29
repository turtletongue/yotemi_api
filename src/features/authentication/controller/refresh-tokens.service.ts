import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import jwtConfig from '@config/jwt.config';
import { RedisService } from '@common/redis';
import { IdentifiersService } from '@common/identifiers';
import { Id } from '@app/app.declarations';
import { MS_IN_SECOND } from '@app/app.constants';
import {
  ExecutorKind,
  RefreshTokenPayload,
  RefreshTokenRecord,
} from '../types';

@Injectable()
export default class RefreshTokensService {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
    private readonly jwt: JwtService,
    private readonly redis: RedisService,
    private readonly identifiers: IdentifiersService,
  ) {}

  public async createRefreshTokenCookie(
    executorId: Id,
    kind: ExecutorKind,
  ): Promise<string> {
    const expiresAt = new Date(
      Date.now() + this.config.refresh.expiresIn * MS_IN_SECOND,
    );

    const tokenId = this.identifiers.generate();
    const tokensKey = this.getTokensListKey(executorId, kind);

    const tokens = await this.getTokens(tokensKey);
    await this.saveValidTokens(tokensKey, [
      ...tokens,
      {
        id: tokenId,
        kind,
        executorId,
        expiresAt: expiresAt.toISOString(),
        createdAt: new Date().toISOString(),
      },
    ]);

    const token = await this.jwt.signAsync(
      { executorId, kind, tokenId },
      {
        secret: this.config.refresh.secret,
        expiresIn: this.config.refresh.expiresIn,
      },
    );

    const cookiePrefix = kind === 'admin' ? 'Admin' : 'User';

    // Refresh token MUST BE in Http Only cookies
    return `${cookiePrefix}Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.config.refresh.expiresIn}`;
  }

  public async saveValidTokens(
    tokensKey: string,
    tokens: RefreshTokenRecord[],
  ): Promise<void> {
    await this.redis
      .getClient()
      .set(
        tokensKey,
        JSON.stringify(
          tokens.filter((record) => new Date(record.expiresAt) > new Date()),
        ),
      );
  }

  public async getTokens(tokensKey: string): Promise<RefreshTokenRecord[]> {
    return JSON.parse(
      (await this.redis.getClient().get(tokensKey)) ?? '[]',
    ) as RefreshTokenRecord[];
  }

  public getTokensListKey(executorId: Id, kind: ExecutorKind): string {
    return `refreshTokens:${kind}:${executorId}`;
  }

  public async getPayload(refreshToken: string): Promise<RefreshTokenPayload> {
    try {
      return this.jwt.verifyAsync(refreshToken, {
        secret: this.config.refresh.secret,
      });
    } catch (error: unknown) {
      this.catchInvalidJwt(error);
      this.catchExpiredJwt(error);

      throw error;
    }
  }

  private catchInvalidJwt(error: unknown): void {
    if (!(error instanceof JsonWebTokenError)) {
      return;
    }

    throw new BadRequestException('Invalid refresh token');
  }

  private catchExpiredJwt(error: unknown): void {
    if (!(error instanceof TokenExpiredError)) {
      return;
    }

    throw new BadRequestException('Refresh token expired');
  }
}
