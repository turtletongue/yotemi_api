import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

import redisConfig from '@config/redis.config';

@Injectable()
export default class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: RedisClientType;

  constructor(
    @Inject(redisConfig.KEY)
    private readonly config: ConfigType<typeof redisConfig>,
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
