import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import tonConfig from '@config/ton.config';
import WalletAuthenticationService from './wallet-authentication.service';
import InterviewContractService from './interview-contract.service';

@Module({
  imports: [ConfigModule.forFeature(tonConfig), HttpModule],
  providers: [WalletAuthenticationService, InterviewContractService],
  exports: [WalletAuthenticationService, InterviewContractService],
})
export default class TonModule {}
