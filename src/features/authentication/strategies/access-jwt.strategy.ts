import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigType } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

import jwtConfig from '@config/jwt.config';
import AdminsRepository from '@features/admins/admins.repository';
import { AdminEntity } from '@features/admins/entities';
import { AdminNotFoundException } from '@features/admins/exceptions';
import UsersRepository from '@features/users/users.repository';
import { UserEntity } from '@features/users/entities';
import { UserNotFoundException } from '@features/users/exceptions';
import { AccessTokenPayload } from '../types';

@Injectable()
export default class AccessJwtStrategy extends PassportStrategy(
  Strategy,
  'access',
) {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
    private readonly adminsRepository: AdminsRepository,
    private readonly usersRepository: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.access.secret,
      ignoreExpiration: false,
    });
  }

  public async validate({
    executorId,
    kind,
  }: AccessTokenPayload): Promise<AdminEntity | UserEntity> {
    try {
      if (kind === 'admin') {
        return await this.adminsRepository.findById(executorId);
      }

      return await this.usersRepository.findById(executorId);
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
