import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import apiConfig from '@config/api.config';
import AdminsModule from '@features/admins';
import PasswordChangingModule from '@features/password-changing';
import AuthenticationModule from '@features/authentication';
import UsersModule from '@features/users';

@Module({
  imports: [
    ConfigModule.forFeature(apiConfig),
    AdminsModule,
    PasswordChangingModule,
    UsersModule,
    AuthenticationModule,
  ],
})
export class AppModule {}
