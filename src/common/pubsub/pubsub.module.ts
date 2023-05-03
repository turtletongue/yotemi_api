import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import pubsubConfig from '@config/pubsub.config';
import PubsubService from './pubsub.service';

@Module({
  imports: [ConfigModule.forFeature(pubsubConfig)],
  providers: [PubsubService],
  exports: [PubsubService],
})
export default class PubsubModule {}
