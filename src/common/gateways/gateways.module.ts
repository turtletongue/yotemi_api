import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import jwtConfig from '@config/jwt.config';
import PrismaModule from '@common/prisma';
import BaseGateway from './base.gateway';

@Module({
  imports: [PrismaModule, JwtModule, ConfigModule.forFeature(jwtConfig)],
  providers: [BaseGateway],
  exports: [BaseGateway],
})
export default class GatewaysModule {}
