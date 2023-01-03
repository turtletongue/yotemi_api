import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import tonConfig from '@config/ton.config';
import TonService from './ton.service';

@Module({
  imports: [ConfigModule.forFeature(tonConfig), HttpModule],
  providers: [TonService],
  exports: [TonService],
})
export default class TonModule {}
