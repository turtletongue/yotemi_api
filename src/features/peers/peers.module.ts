import { Module } from '@nestjs/common';

import IdentifiersModule from '@common/identifiers';
import GatewaysModule from '@common/gateways';
import PeersService from './controllers/peers.service';
import PeersController from './controllers/peers.controller';
import PeersGateway from './peers.gateway';

@Module({
  imports: [IdentifiersModule, GatewaysModule],
  controllers: [PeersController],
  providers: [PeersService, PeersGateway],
})
export default class PeersModule {}
