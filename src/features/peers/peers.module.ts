import { Module } from '@nestjs/common';

import PubsubModule from '@common/pubsub';
import InterviewsModule from '@features/interviews';
import PeersService from './controllers/peers.service';
import PeersController from './controllers/peers.controller';
import PeersProducer from './peers.producer';

@Module({
  imports: [InterviewsModule, PubsubModule],
  controllers: [PeersController],
  providers: [PeersService, PeersProducer],
})
export default class PeersModule {}
