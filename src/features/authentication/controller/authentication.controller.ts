import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AdminEntity } from '@features/admins/entities';
import { UserEntity } from '@features/users/entities';
import AuthenticationResultDto from './dto/authentication-result.dto';
import AuthenticateAdminDto from './dto/authenticate-admin.dto';
import AuthenticateUserDto from './dto/authenticate-user.dto';
import AuthenticationService from './authentication.service';
import RefreshTokensService from './refresh-tokens.service';
import { Executor } from '../decorators';
import { RefreshGuard } from '../guards';

@ApiTags('authentication')
@Controller('authentication')
export default class AuthenticationController {
  constructor(
    private readonly authentication: AuthenticationService,
    private readonly refreshTokens: RefreshTokensService,
  ) {}

  /**
   * Authenticate admin and get access token
   * in response, refresh token in cookies.
   */
  @Post('admin')
  @ApiCreatedResponse({
    description: 'Use accessToken in the Authenticate header with Bearer.',
    type: AuthenticationResultDto,
  })
  public async authenticateAdmin(
    @Body() dto: AuthenticateAdminDto,
    @Res() response: Response,
  ): Promise<void> {
    const result = await this.authentication.authenticateAdmin(dto);
    const cookie = await this.refreshTokens.createRefreshTokenCookie(
      result.admin.id,
      'admin',
    );

    response.setHeader('Set-Cookie', cookie);
    response.json(result);
  }

  /**
   * Authenticate user and get access token
   * in response, refresh token in cookies.
   */
  @Post()
  @ApiCreatedResponse({
    description: 'Use accessToken in the Authenticate header with Bearer.',
    type: AuthenticationResultDto,
  })
  public async authenticateUser(
    @Body() dto: AuthenticateUserDto,
    @Res() response: Response,
  ): Promise<void> {
    const result = await this.authentication.authenticateUser(dto);
    const cookie = await this.refreshTokens.createRefreshTokenCookie(
      result.user.id,
      'user',
    );

    response.setHeader('Set-Cookie', cookie);
    response.json(result);
  }

  /**
   * Revoke refresh token and clear authentication cookie.
   */
  @ApiCookieAuth()
  @ApiCreatedResponse({
    description:
      'Refresh token has been revoked and cannot be used in future requests',
  })
  @UseGuards(RefreshGuard)
  @Post('revoke')
  public async revokeRefreshToken(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const token = request.cookies?.Refresh;
    const cookie = await this.authentication.revokeRefreshToken(token);
    response.setHeader('Set-Cookie', cookie);

    response.send();
  }

  /**
   * Refresh access token.
   */
  @ApiCookieAuth()
  @ApiCreatedResponse({
    type: AuthenticationResultDto,
    description: 'Use accessToken in the Authenticate header with Bearer',
  })
  @UseGuards(RefreshGuard)
  @Post('refresh')
  public async refreshAccessToken(
    @Req() request: Request,
    @Executor() executor: AdminEntity | UserEntity,
    @Res() response: Response,
  ): Promise<void> {
    const token = request.cookies?.Refresh;
    const accessToken = await this.authentication.refreshAccess(token);
    const cookie = await this.refreshTokens.createRefreshTokenCookie(
      executor.getId(),
      executor.kind,
    );

    response.setHeader('Set-Cookie', cookie);
    response.json({
      accessToken,
    });
  }
}
