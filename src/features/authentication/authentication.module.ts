import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import jwtConfig from '@config/jwt.config';
import IdentifiersModule from '@common/identifiers';
import RedisModule from '@common/redis';
import TonModule from '@common/ton';
import AdminsModule from '@features/admins';
import UsersModule from '@features/users';
import AuthenticationController, { authenticationServices } from './controller';
import authenticationStrategies from './strategies';

@Module({
  imports: [
    IdentifiersModule,
    AdminsModule,
    UsersModule,
    RedisModule,
    TonModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)],
      useFactory: async (config: ConfigType<typeof jwtConfig>) => ({
        secret: config.access.secret,
        signOptions: {
          expiresIn: config.access.expiresIn,
        },
      }),
      inject: [jwtConfig.KEY],
    }),
  ],
  controllers: [AuthenticationController],
  providers: [...authenticationServices, ...authenticationStrategies],
})
export default class AuthenticationModule {}
