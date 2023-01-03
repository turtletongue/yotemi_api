import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import apiConfig from '@config/api.config';
import PrismaService from './prisma.service';

@Module({
  imports: [ConfigModule.forFeature(apiConfig)],
  providers: [PrismaService],
  exports: [PrismaService],
})
export default class PrismaModule {}
