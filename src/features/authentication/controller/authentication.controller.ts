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
import { RefreshAdminGuard, RefreshUserGuard } from '../guards';
import { Admin, User } from '../decorators';

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
   * Revoke admin refresh token and clear authentication cookie.
   */
  @ApiCookieAuth()
  @ApiCreatedResponse({
    description:
      'Refresh token has been revoked and cannot be used in future requests',
  })
  @UseGuards(RefreshAdminGuard)
  @Post('admin/revoke')
  public async revokeAdminRefreshToken(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const token = request.cookies?.AdminRefresh;
    const cookie = await this.authentication.revokeRefreshToken(token);
    response.setHeader('Set-Cookie', cookie);

    response.send();
  }

  /**
   * Revoke user refresh token and clear authentication cookie.
   */
  @ApiCookieAuth()
  @ApiCreatedResponse({
    description:
      'Refresh token has been revoked and cannot be used in future requests',
  })
  @UseGuards(RefreshUserGuard)
  @Post('revoke')
  public async revokeUserRefreshToken(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const token = request.cookies?.UserRefresh;
    const cookie = await this.authentication.revokeRefreshToken(token);
    response.setHeader('Set-Cookie', cookie);

    response.send();
  }

  /**
   * Refresh admin access token.
   */
  @ApiCookieAuth()
  @ApiCreatedResponse({
    type: AuthenticationResultDto,
    description: 'Use accessToken in the Authenticate header with Bearer',
  })
  @UseGuards(RefreshAdminGuard)
  @Post('admin/refresh')
  public async refreshAdminAccessToken(
    @Req() request: Request,
    @Admin() executor: AdminEntity,
    @Res() response: Response,
  ): Promise<void> {
    const token = request.cookies?.AdminRefresh;
    const accessToken = await this.authentication.refreshAccess(token);
    const cookie = await this.refreshTokens.createRefreshTokenCookie(
      executor.id,
      executor.kind,
    );

    response.setHeader('Set-Cookie', cookie);
    response.json({
      accessToken,
    });
  }

  /**
   * Refresh user access token.
   */
  @ApiCookieAuth()
  @ApiCreatedResponse({
    type: AuthenticationResultDto,
    description: 'Use accessToken in the Authenticate header with Bearer',
  })
  @UseGuards(RefreshUserGuard)
  @Post('refresh')
  public async refreshUserAccessToken(
    @Req() request: Request,
    @User() executor: UserEntity,
    @Res() response: Response,
  ): Promise<void> {
    const token = request.cookies?.UserRefresh;
    const accessToken = await this.authentication.refreshAccess(token);
    const cookie = await this.refreshTokens.createRefreshTokenCookie(
      executor.id,
      executor.kind,
    );

    response.setHeader('Set-Cookie', cookie);
    response.json({
      accessToken,
    });
  }
}
