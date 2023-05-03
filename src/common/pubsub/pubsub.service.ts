import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

import pubsubConfig from '@config/pubsub.config';

@Injectable()
export default class PubsubService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PubsubService.name);
  private readonly client: RedisClientType;

  constructor(
    @Inject(pubsubConfig.KEY)
    private readonly config: ConfigType<typeof pubsubConfig>,
  ) {
    this.client = createClient({
      url: config.connection,
    });

    this.client.on('error', (error) => {
      this.logger.error(error.message, error);
    });
  }

  public async onModuleInit(): Promise<void> {
    await this.client.connect();
  }

  public async onModuleDestroy(): Promise<void> {
    await this.client.disconnect();
  }

  public getClient(): RedisClientType {
    return this.client;
  }
}
