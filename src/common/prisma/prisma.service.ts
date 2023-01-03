import { Inject, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaClientOptions } from '@prisma/client/runtime';

import apiConfig from '@config/api.config';

export default class PrismaService
  extends PrismaClient<PrismaClientOptions, 'query'>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaClient.name);

  constructor(
    @Inject(apiConfig.KEY)
    private readonly config: ConfigType<typeof apiConfig>,
  ) {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
      ],
    });

    if (config.environment === 'development') {
      this.$on('query', (event) => {
        this.logger.log(`Query: ${event.query}`);
        this.logger.log(`Params: ${event.params}`);
        this.logger.log(`Duration: ${event.duration}ms`);
      });
    }
  }

  public async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  public async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
